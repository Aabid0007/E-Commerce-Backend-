const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require('./middleware/errorHandler');
const connectDb = require("./config/dbConnection");
const path = require("path");
const cors = require('cors');
const cookieParser = require("cookie-parser");


connectDb();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000',credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/categorys', require("./routes/categoryRoutes"));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRouter'));
app.use('/api/admin', require("./routes/adminRoutes"));
app.use('/api/order', require('./routes/orderRoutes'));
app.use('/api/cart', require("./routes/cartRoutes"));
app.use('/api/stripe', require('./routes/paymentRoutes'));
app.use("/uploads", express.static(path.resolve(__dirname, 'uploads')));

app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});