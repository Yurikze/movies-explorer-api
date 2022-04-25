const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { appRouter } = require('./routes');
const cors = require('./middlewares/cors');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

appRouter(app);

app.use(errors());
app.use(error);
app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
