class libProvider{

    get log4js(){
        return require('./logger');
    }

    get needle(){
        return require('needle');
    }

    get fileManager(){
        return require('./file-manager');
    }

    get config(){
        return require('../config/index');
    }

    get nodeCrawler(){
        return require('crawler');
    }
    
    get crawler() {
        return require('../core/crawl-sprite');
    }

    get schedule(){
        return require('../core/schedule');
    }

    constructor(){
        require('../extends/index');
    };

    getFetcher(type) {
        let worker = null;
        switch(type) {
            case "image": 
                worker = require('../components/image-fetcher');
                break;
            default:;
                break;
        }
        return worker;
    }
}
module.exports = new libProvider();