import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { User } from "../models/User.js";
import { Item } from "../models/Item.js";
import { Order } from "../models/Orders.js";

// GET STATS OF THE SHOP
export const getDashboardStats = asyncErrorHandler(async (req, res, next) => {
  let stats = {};

  const today = new Date();
  const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );

  const sixMonthAgo = new Date();
  sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

  const lastSixMonthOrdersPromise = Order.find({
    orderedOn: {
      $gte: sixMonthAgo,
      $lte: today,
    },
  });

  // Resolving Promises
  const [
    lastSixMonthOrders,
    totalOrders,
    totalUsers,
    totalItems,
    categories,
    allOrders,
    processingOrdersCount,
    deliveredOrdersCount,
    cancelledOrdersCount,
  ] = await Promise.all([
    lastSixMonthOrdersPromise,
    Order.countDocuments(),
    User.countDocuments(),
    Item.countDocuments(),
    Item.distinct("category"),
    Order.find({}),
    Order.countDocuments({ status: "processing" }),
    Order.countDocuments({ status: "delivered" }),
    Order.countDocuments({ status: "cancelled" }),
  ]);

  // Last Six month orders and revenue
  const orderMonthCounts = new Array(6).fill(0);
  const orderMonthlyRevenue = new Array(6).fill(0);

  lastSixMonthOrders.forEach((order) => {
    const creationDate = order.orderedOn;
    const monthDiff = today.getMonth() - creationDate.getMonth();

    if (monthDiff < 6) {
      orderMonthCounts[5 - monthDiff] += 1;
      orderMonthlyRevenue[5 - monthDiff] += order.totalAmount;
    }
  });

  const lastSixMonthRevenue = lastSixMonthOrders.reduce(
    (total, order) => total + (order.totalAmount || 0),
    0
  );

  const totalRevenue = Math.round(
    allOrders.reduce((total, order) => total + (order.totalAmount || 0), 0)
  );

  // Inventory
  const categoriesCountPromise = categories.map((category) =>
    Item.countDocuments({ category })
  );
  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount = [];
  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / totalItems) * 100),
    });
  });

  // Male-Female ratio
  const femaleCount = await User.countDocuments({ gender: "female" });

  const userRatio = {
    male: totalUsers - femaleCount,
    female: femaleCount,
  };

  // Revenue Distribution Among Items
  const revenueDistributionItems = [];
  const revenueDistributionAmount = [];
  allOrders.forEach((order) => {
    order.orderItems.forEach((item) => {
      if (!revenueDistributionItems.includes(item.name)) {
        revenueDistributionItems.push(item.name);
        revenueDistributionAmount.push(item.quantity * item.discountedPrice);
      } else {
        const reqIndex = revenueDistributionItems.indexOf(item.name);

        revenueDistributionAmount[reqIndex] =
          revenueDistributionAmount[reqIndex] +
          item.quantity * item.discountedPrice;
      }
    });
  });

  stats = {
    categoryCount,
    totalItems,
    totalUsers,
    totalOrders,
    totalRevenue,
    categories,
    lastSixMonthOrders,
    lastSixMonthRevenue,
    orderMonthCounts,
    orderMonthlyRevenue,
    userRatio,
    processingOrdersCount,
    deliveredOrdersCount,
    cancelledOrdersCount,
    chart: {
      revenueDistribution: {
        revenueDistributionItems,
        revenueDistributionAmount,
      },
    },
  };

  res.status(200).json({
    success: true,
    stats,
  });
});
