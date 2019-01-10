const dayjs = require('dayjs');
const SAVE_PATH = `./img/${dayjs().format('YYYYMMDD')}`;
module.exports = {
     SAVE_PATH,
     entry: 'https://www.jd.com',
     appSetting: {
          interval: 1000,
          maxPages: 100
     }
};