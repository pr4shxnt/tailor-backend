const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Database/db");
const masterCategoryRoute = require('./Routes/masterCategoryRoute');
const categoryRoute = require('./Routes/categoryRoutes');
const subCategoryRoute = require('./Routes/subCategoryRoute');

dotenv.config();

const app = express();

 
app.use(cors());
app.use(express.json());

 
connectDB();

 
app.use('/api/masterCategories', masterCategoryRoute); 
app.use('/api/categories', categoryRoute); 
app.use('/api/subCategories', subCategoryRoute);

 
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Local:   http://localhost:${PORT}/`);
});
