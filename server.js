const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Database/db");
const masterCategoryRoute = require('./Routes/masterCategoryRoute');
const categoryRoute = require('./Routes/categoryRoutes');
const subCategoryRoutes = require('./Routes/subCategoryRoute');
const adminRoutes = require("./Routes/adminRoute");
const ProductRoutes = require("./Routes/ProductRoute");
const path = require('path');
const userRoutes = require('./Routes/userRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const wishRoutes = require("./Routes/wishRoutes")
const ReviewRoutes = require("./Routes/ReviewRoutes")

dotenv.config();

const app = express();

 
app.use(cors());
app.use(express.json());

 
connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/masterCategories', masterCategoryRoute); 
app.use('/api/categories', categoryRoute); 
app.use('/api/subCategories', subCategoryRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/products", ProductRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishRoutes)
app.use("/api/review", ReviewRoutes)

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Local:   http://localhost:${PORT}/`);
});
