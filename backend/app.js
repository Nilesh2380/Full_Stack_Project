require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 4000;
const app = express();

const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');
const { mongooseErrorHandler } = require('./middlewares/errorMiddlwr');

const { connectDB } = require('./db/connect');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

connectDB();

app.use('/user', userRouter);
app.use('/product', productRouter);

app.use(mongooseErrorHandler);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
