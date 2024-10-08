const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

dotenv.config();

app.use(
    cors({
        origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ivy-ui-self.vercel.app',
        credentials: true,
    }),
);

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
