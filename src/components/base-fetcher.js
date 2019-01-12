var libHost = require('../helpers/lib-provider');
var needle = libHost.needle;
var fileManager = libHost.fileManager;
class BaseFetcher {
    constructor(options = () => { throw new Error('Provide default paramter please!'); }){
        this.options = options
        this.prefix = this.options.url.startsWith('https') ? 'https:' : 'http:';
    }

    /**
     * 由子类决定要分析什么东西
     */
    readSpecificRegExp() {
        throw new Error('Provide a available regular expression!');
    }

    readUrisFromReponse(response){
        if(typeof response !== "string") {
            return [];
        }
        return response.match(this.readSpecificRegExp()) || [];
    }

    beforeFetch(length){
        let lower_standard = this.options.minSize !== undefined ? this.options.minSize * 1024 : 100 * 1024;
        let upper_standard = this.options.maxSize !== undefined ? this.options.maxSize * 1024 : Infinity;
        return length >=lower_standard && upper_standard >= length;
    }

    async fetch () {
        throw new Error('Not implement exception!');
    }

    async doWork(fetch_uris) {
        let results = null;
        if(Array.isArray(fetch_uris)) {
            results = await Promise.all(fetch_uris.map(uri => this._doWork(uri)));
        } else {
            results = await this._doWork(fetch_uris);
        }
        return results;
    }

    _doWork(src){
        if(!src.startsWith('https') && !src.startsWith('http')) {
            src = this.prefix + src;
        }
        needle('get', src).then(response => {
            if(!this.beforeFetch(response.bytes)) return;
            response.setEncoding('binary');
            let filename = fileManager.getFileName(src);
            let save_path = fileManager.getSavePath(filename);
            return fileManager.createFile(save_path, response.raw);
        });
    }

}

module.exports = BaseFetcher;