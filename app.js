const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { router } = require('./routes');
const cors = require('./middlewares/cors');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');

const { PORT = 3000, DB = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();

app.use(cookieParser());

mongoose.connect(DB, {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());
app.use(requestLogger);
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);

app.use(errors());
app.use(error);
app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
