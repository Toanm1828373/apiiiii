const express = require('express');
const router = express.Router();
const request = require('request');
const logger = require('../logger');

// Định nghĩa API /pinterest
router.get('/', async (req, res, next) => {
  const search = req.query.search;
  if (!search) {
    logger.warn('Thiếu dữ liệu để thực thi lệnh');
    return res.status(400).json({ error: 'Thiếu dữ liệu để thực thi lệnh' });
  }

  const headers = {
    'authority': 'www.pinterest.com',
    'cache-control': 'max-age=0',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'sec-gpc': '1',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'same-origin',
    'sec-fetch-dest': 'empty',
    'accept-language': 'en-US,en;q=0.9'
  };

  const options = {
    url: 'https://www.pinterest.com/search/pins/?q=' + search + '&rs=typed&term_meta[]=' + search + '%7Ctyped',
    headers: headers
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const arrMatch = body.match(/https:\/\/i\.pinimg\.com\/originals\/[^.]+\.jpg/g);
      return res.json({
        count: arrMatch.length,
        data: arrMatch
      });
    } else {
      logger.error(`Error fetching data from Pinterest: ${error.message}`);
      next(new Error('Error fetching data from Pinterest'));
    }
  }

  request(options, callback);
});

module.exports = router;
