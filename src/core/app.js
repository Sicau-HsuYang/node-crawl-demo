require('../extends/index');
var Schedule = require('./schedule');
var fileManager = require('../helpers/file-manager');
var config = require('../config/index');
class App {
    constructor(options = {}){
        this.options = options;
    }

    async run(url) {
        await fileManager.dirExists(config.SAVE_PATH);
        var schedule = new Schedule(this.options);
        schedule.start(url);
    }
}

module.exports = App;