const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const port = 5000;

dotenv.config();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    }),
);

const db = require('./config/db');
db.connect();

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

const route = require('./router');
route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
