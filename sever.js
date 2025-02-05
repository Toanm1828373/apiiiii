const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const logger = require('./logger');

app.use(express.json());

const apiDirectory = path.join(__dirname, 'api');
const apiFiles = fs.readdirSync(apiDirectory);

// Đếm số file API đã tải thành công
let apiCount = 0;

// Đọc tất cả các tệp API trong thư mục `./api`
apiFiles.forEach(file => {
  const apiPath = path.join(apiDirectory, file);
  const route = `/${file.replace('.js', '')}`;
  app.use(route, require(apiPath));
  apiCount++;
  logger.info(`[ LOADING ] -> Đã tải thành công ${file}`);
});

logger.info(`[ LOADING ] -> Đã load thành công ${apiCount} file API`);

// Middleware để xử lý lỗi
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Xử lý lỗi 404
app.use((req, res, next) => {
  logger.warn(`404 Not Found: ${req.originalUrl}`);
  res.status(404).send('Sorry, cannot find that!');
});

// Khởi động server
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
