const App = require('./core/app');
new App({
    interval: 1000,
    maxPages: 1024
}).run('https://www.jd.com');