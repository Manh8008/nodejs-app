const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

// Sử dụng biến môi trường từ file .env
dotenv.config();

// Cấu hình port, mặc định sử dụng port 5000 nếu không có biến môi trường
const port = process.env.PORT || 5000;

// Cấu hình CORS theo môi trường
app.use(
    cors({
        origin:
            process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : ['https://manhxanh.id.vn', 'https://nextjs-shop-rouge.vercel.app'],
        credentials: true,
    }),
);

app.use('/', (req, res) => {
    res.send('Home page');
});

console.log(process.env.NODE_ENV);

// Kết nối database
const db = require('./config/db');
db.connect();

// Middleware setup
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Cấu hình router
const route = require('./router');
route(app);

// Start server và lắng nghe port
app.listen(port, '0.0.0.0', () => {
    console.log(`App listening at http://localhost:${port}`);
});
