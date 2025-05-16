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

app.use('/api/category', require("./routes/category.routes"));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/admin', require("./routes/admin.routes"));
app.use('/api/order', require('./routes/order.routes'));
app.use('/api/cart', require("./routes/cart.routes"));
app.use('/api/stripe', require('./routes/payment.routes'));
app.use('/api/bestseller', require("./routes/bestSeller.routes"));
app.use('/api/subCategory', require('./routes/subCategory.routes'));
app.use("/uploads", express.static(path.resolve(__dirname, 'uploads')));

app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});