class log4js{
    constructor(){
        this._lib_log4js = null;
        this.initialize();
    }

    getConsoleLogger () {
        return libHost.log4js.getLogger('default');
    }

    getSystemLogger () {
        return libHost.log4js.getLogger('sys');
    }

    initialize() {
        if(!this._lib_log4js) {
            let is_mac = process.platform == 'darwin';
            let file_path = is_mac ? '/tmp/logs/crawler' : 'logs/crawler';
            this._lib_log4js = require('log4js');
            this._lib_log4js.configure({
                appenders: {
                    default: { type: 'console' },
                    appender_sys: { type: 'dateFile', filename: file_path, pattern: '-yyyy-MM-dd.log', alwaysIncludePattern: true },
                    appender_trd: { type: 'dateFile', filename: file_path, pattern: '-yyyy-MM-dd.log', alwaysIncludePattern: true }
                },
                categories: {
                    default: { appenders: ['default'], level: 'ALL' },
                    sys: { appenders: ['appender_sys'], level: 'ALL' },
                }
            });
        }
    }
}

module.exports = new log4js();