# Grocery Store MERN Application


![Vercel](https://img.shields.io/badge/Frontend-Vercel-blue?logo=vercel&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/State-Redux%20Toolkit-purple?logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/Routing-React_Router-red?logo=reactrouter&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Backend-Express-black?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-blue?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Authentication-JWT-yellow?logo=jwt&logoColor=black)
![Stripe](https://img.shields.io/badge/Payment-Stripe-blue?logo=stripe&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-red?logo=nodemailer&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloud-Cloudinary-blue?logo=cloudinary&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Animation-FramerMotion-pink?logo=framer&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-blueviolet?logo=vite&logoColor=white)
![Font Awesome](https://img.shields.io/badge/UI-FontAwesome-orange?logo=fontawesome&logoCol)

A full-stack **MERN (MongoDB, Express, React, Node.js)** e-commerce application built as a personal project.  
It features user authentication, cart and wishlist management, orders with payment options, automated email notifications, and an admin dashboard.

**Live Demo:** [Grocery Store MERN App](https://grocery-store-mern-frontend-seven.vercel.app/)

---

## ✨ Key Features

### User Features
- User signup and login with **email confirmation**
- JWT-based authentication using **HTTP-only cookies**
- Add items to **cart** (only when logged in)
- Wishlist functionality works for both **logged-in and logged-out users**
- User profile page:
  - View cart items
  - View order history
- Place orders with:
  - Card payment (simulated)
  - Cash on Delivery (COD)
- Automatic email notifications:
  - Order placed
  - Order delivered

---

### Admin Features
- Secure admin dashboard
- View all users
- View and manage orders
- Update order status
- Add, edit, and delete products/items
- Full control over inventory and orders

---

## 🛠 Tech Stack

### Frontend
- React
- Redux Toolkit & RTK Query
- Bootstrap (Ogani template converted to React)
- Vite

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cookie-based auth
- Joi (validation)
- Nodemailer (email automation)

### Deployment
- Frontend: Vercel
- Backend: Render / Railway
- Database: MongoDB Atlas

---

## 📁 Project Structure

```txt
root/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── services/
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   └── index.js
│
└── README.md
```

## 🔐 Authentication & Security

- JWT-based authentication
- Tokens stored in **HTTP-only cookies**
- Protected routes via Express middleware
- Role-based access for admin routes
- Password hashing
- Centralized API error handling

---

## 🌍 API Overview

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/auth/signup` | User signup with email verification |
| POST   | `/api/auth/login`  | User login |
| GET    | `/api/user/profile` | Fetch user profile |
| POST   | `/api/cart` | Add item to cart |
| GET    | `/api/cart` | Get user cart |
| POST   | `/api/orders` | Place order |
| GET    | `/api/orders` | Get user orders |
| PATCH  | `/api/orders/:id` | Update order status (Admin) |
| GET    | `/api/admin/users` | View all users (Admin) |
| POST   | `/api/admin/products` | Add product (Admin) |
| PATCH  | `/api/admin/products/:id` | Update product (Admin) |

---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

## 📧 Email Automation

This application includes automated email notifications to keep users informed about their account and orders.

- Email confirmation sent when a user signs up for the first time
- Order confirmation email sent when an order is placed
- Order delivery notification sent when an order status is updated
- Implemented using **Nodemailer** on the backend

---

## 🚀 Deployment Notes

- Frontend deployed on **Vercel** ([Live Demo](https://grocery-store-mern-frontend-seven.vercel.app/))
- Backend deployed on **Render / Railway**
- MongoDB hosted on **MongoDB Atlas**
- CORS configured to allow credentials
- Cookies configured with:
  - `httpOnly: true`
  - `secure: true` (production)
  - `sameSite: none`

---

## ⚠️ Known Limitations

- Card payment is currently simulated (no real payment gateway)
- Refresh token rotation not implemented
- Basic admin analytics only

---

## 🔮 Future Improvements

- Integrate real payment gateways (Razorpay / Stripe)
- Implement refresh token & session rotation
- Product reviews and ratings
- Advanced admin analytics dashboard
- Performance and scalability optimizations

---

## 🙏 Credits / Acknowledgements

- This project uses the **Ogani Bootstrap HTML template** originally created by [Colorlib](https://colorlib.com/wp/template/ogani/) and hosted on [ThemeWagon](https://themewagon.com/themes/free-bootstrap-4-html5-responsive-ecommerce-website-template-ogani/).  
- The template has been **converted and customized to React** for this MERN stack project.  
- All backend functionality, features, and logic were implemented personally.


## 📜 License

This project is developed for **personal and educational purposes only**.

---

## 👤 Author

**Parth Patel**  
GitHub: https://github.com/parthp-labs

---

> This project demonstrates a complete MERN stack e-commerce application with authentication, cart and wishlist management, orders, email automation, and an admin dashboard.
