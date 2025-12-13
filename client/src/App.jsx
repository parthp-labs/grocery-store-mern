import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";

import { useGetUserQuery, useLazyGetUserQuery } from "./redux/api/userApi.js";

import "./js/jquery-3.3.1.min.js";
import "./js/bootstrap.min.js";
import "./js/jquery.nice-select.min.js";
import "./js/jquery-ui.min.js";
import "./js/jquery.slicknav.js";
import "./js/mixitup.min.js";
import "./js/main.js";

import "./styles/css/bootstrap.min.css";
import "./styles/css/nice-select.css";
import "./styles/css/jquery-ui.min.css";
import "./styles/css/slicknav.min.css";
import "./styles/css/style.css";

import Loader from "./components/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer.jsx";

import { store } from "./redux/store.js";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { userExists, userNotExists } from "./redux/reducers/userReducer.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Verification from "./pages/Verification.jsx";

const Cart = lazy(() => import("./pages/Cart"));
const LoginSignup = lazy(() => import("./pages/LoginSignup"));

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Contact = lazy(() => import("./pages/Contact"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
// const AllBlogs = lazy(() => import("./pages/AllBlogs.jsx"));
// const BlogDetails = lazy(() => import("./pages/BlogDetails.jsx"));
const AllOrders = lazy(() => import("./pages/admin/Orders.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.jsx"));
const OrderFailed = lazy(() => import("./pages/OrderFailed.jsx"));
const ViewOrder = lazy(() => import("./pages/ViewOrder.jsx"));

const ProcessOrder = lazy(() => import("./pages/admin/ProcessOrder.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const Dashboard = lazy(() => import("./components/admin/Dashboard.jsx"));
const Users = lazy(() => import("./pages/admin/Users.jsx"));
const Items = lazy(() => import("./pages/admin/Items.jsx"));
const AddNewItem = lazy(() => import("./pages/admin/AddNewItem.jsx"));
const EditItem = lazy(() => import("./pages/admin/EditItem.jsx"));
const ViewOrderAdmin = lazy(() => import("./pages/admin/ViewOrder.jsx"));
// const Blogs = lazy(() => import("./pages/admin/Blogs.jsx"));
// const EditBlog = lazy(() => import("./pages/admin/EditBlog.jsx"));
// const CreateBlog = lazy(() => import("./pages/admin/CreateBlog.jsx"));
// const ViewBlog = lazy(() => import("./pages/admin/ViewBlog.jsx"));

function App() {
  const dispatch = useDispatch();

  const [getUser, { data, isLoading }] = useLazyGetUserQuery();
  const { user } = useSelector((state) => state.userReducer);
  const { loading } = useSelector((state) => state.loaderReducer);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(userExists(data.user));
    } else {
      dispatch(userNotExists());
    }
  }, [data]);

  useEffect(() => {}, []);

  return (
    <>
      <Router>
        <Header user={user} />
        <Loader isLoading={loading} darkBg={false} />
        <Suspense fallback={<Loader isLoading={true} darkBg={true} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop getUserFunc={getUser} />} />
            <Route path="/shop/:itemId" element={<ProductDetails />} />
            <Route path="/register" element={<LoginSignup />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verify" element={<Verification />} />
            {/* <Route path="/blogs/:blogId" element={<BlogDetails />} />
            <Route path="/blogs/:blogId" element={<BlogDetails />} />
            <Route path="/blogs" element={<AllBlogs />}></Route> */}

            {/* Login Only Routes */}
            <Route
              element={
                <ProtectedRoute
                  user={user ? true : false}
                  redirect={"/register"}
                />
              }
            >
              <Route path="/cart" element={<Cart />}></Route>
              <Route path="/checkout" element={<Checkout user={user} />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/orders" element={<Orders />} />
              <Route path="/order/success" element={<OrderSuccess />} />
              <Route path="/order/fail" element={<OrderFailed />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:orderId" element={<ViewOrder />} />
            </Route>

            {/* Admin Only Routes */}
            <Route
              element={
                <ProtectedRoute
                  user={user}
                  adminOnly={true}
                  redirect={"/register"}
                />
              }
            >
              <Route path="/admin" element={<AdminDashboard user={user} />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<Users />} />

                <Route path="/admin/items" element={<Items />} />
                <Route path="/admin/items/new" element={<AddNewItem />} />
                <Route
                  path="/admin/items/:itemId/edit"
                  element={<EditItem />}
                />

                <Route path="/admin/orders" element={<AllOrders />} />
                <Route
                  path="/admin/orders/view/"
                  element={<ViewOrderAdmin />}
                />
                <Route
                  path="/admin/orders/process/"
                  element={<ProcessOrder />}
                />

                {/* <Route path="/admin/blogs" element={<Blogs />} />
                <Route path="/admin/blogs/new" element={<CreateBlog />} />
                <Route path="/admin/blogs/edit" element={<EditBlog />} />
                <Route path="/admin/blogs/view" element={<ViewBlog />} /> */}
              </Route>
            </Route>
          </Routes>
        </Suspense>
        <Footer />
        <ToastContainer position="bottom-center" />
      </Router>
    </>
  );
}

export default App;
