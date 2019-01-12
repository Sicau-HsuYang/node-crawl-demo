var libHost = require('../helpers/lib-provider');
var { SAVE_PATH } = libHost.config;
class App {
    constructor(options = {}){
        this.options = options;
        if (options.force){
            this.destroyAll();
        }
    }

    destroyAll(){

    }

    async run() {
        await libHost.fileManager.dirExists(SAVE_PATH);
        var schedule = new libHost.schedule();
        schedule.start();
    }
}

module.exports = App;