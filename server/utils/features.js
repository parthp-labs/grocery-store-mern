import ExcelJs from "exceljs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getLastSixMonths = () => {
  const currentDate = new Date();
  currentDate.setDate(1);

  const lastSixMonths = [];

  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(currentDate);
    monthDate.setMonth(currentDate.getMonth() - i);
    const monthName = months[monthDate.getMonth()];
    lastSixMonths.unshift(monthName);
  }

  return lastSixMonths;
};

export const generateInvoice = async ({
  firstName,
  lastName,
  phoneNumber,
  email,
  streetInfo,
  houseNumber,
  city,
  pinCode,
  state,
  orderId,
  orderPlacedOn,
  paymentMode,
  orderItems,
  subTotal,
  discount,
  deliveryCharges,
  totalAmount,
}) => {
  try {
    // Opening the template invoice
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const workbook = new ExcelJs.Workbook();

    await workbook.xlsx.readFile(
      `${path.join(__dirname, "/invoice_template.xlsx")}`
    );

    const worksheet = workbook.getWorksheet(1);

    const newDate = new Date(orderPlacedOn);
    // Inserting data
    // --- Invoice Details
    worksheet.getCell("H4").value = "ORDER ID: " + orderId;
    worksheet.getCell("H6").value =
      "PLACED ON: " +
      `${newDate.getDate()} ${
        months[newDate.getMonth() - 1]
      } ${newDate.getFullYear()}`;
    worksheet.getCell("H8").value = "PAYMENT MODE:" + paymentMode;

    // --- User Details
    // --- Name ---
    worksheet.getCell("B12").value = firstName + " " + lastName;

    // --- Phone & Email ---
    worksheet.getCell("B13").value = phoneNumber;
    worksheet.getCell("B14").value = email;

    // --- Delivery Details
    // --- HouseNumber
    worksheet.getCell("F12").value = houseNumber;
    worksheet.getCell("F13").value = streetInfo;
    worksheet.getCell("F14").value = city + ", " + pinCode;
    worksheet.getCell("F15").value = state;

    // --- Order Items
    let row = 20;

    orderItems.forEach((item) => {
      worksheet.insertRow(row, [
        item.name,
        item.quantity,
        item.price,
        item.discount,
        item.discountedPrice,
        item.discountedPrice * item.quantity,
      ]);
      // --- Item Description
      worksheet.getCell(`B${row}`).value = item.name;
      // --- Item Quantity
      worksheet.getCell(`D${row}`).value = item.quantity;
      // --- Item Price
      worksheet.getCell(`E${row}`).value = item.originalPrice;
      // --- Item Discount
      worksheet.getCell(`F${row}`).value = item.discount;
      // --- Item DiscountedPrice
      worksheet.getCell(`G${row}`).value = item.discountedPrice;
      // --- Item Total
      worksheet.getCell(`H${row}`).value = item.discountedPrice * item.quantity;

      row += 1;
    });

    // --- Order Subtotal & Total
    worksheet.getCell(`H${row}`).value = subTotal;
    worksheet.getCell(`H${row + 1}`).value = discount;
    worksheet.getCell(`H${row + 2}`).value = deliveryCharges;
    worksheet.getCell(`H${row + 3}`).value = totalAmount;

    // Saving the edited invoice to new file
    const invoicesDirectory = path.join(__dirname, "..", "public", "invoices");

    const fileName = `order${orderId}.xlsx`;
    const filePath = path.join(invoicesDirectory, fileName);

    await workbook.xlsx.writeFile(filePath);
  } catch (error) {
    console.log(error);
    return error;
  }
};
