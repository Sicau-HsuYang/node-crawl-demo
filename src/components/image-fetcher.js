var needle = require('needle');
var fs = require('fs');
var fileManager = require('../helpers/file-manager');
class ImageFetcher {
    /**
     * 抓取图片的约束
     * @param {*} options 
     * size: 1kb,
     * ext: 'jpg', 'jpeg', 'gif', 'png'
     */
    constructor(options = { ext: ['jpg', 'jpeg', 'gif', 'png'] }){
        this.options = options;
        this.prefix = this.options.url.startsWith('https') ? 'https:' : 'http:';
        let matchImgs = this.options.ext.map(x => `(${x})`).join('|');
        this.imgRegExp = new RegExp('((http(s)?)|(ftp):)?\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:\\/~\\+#]*[\\w\\-\\@?^=%&\\/~\\+#])?\.('+ matchImgs +')','g');
    }

    beforeFetch(length){
        let lower_standard = this.options.minSize !== undefined ? this.options.minSize * 1024 : 100 * 1024;
        let upper_standard = this.options.maxSize !== undefined ? this.options.maxSize * 1024 : Infinity;
        return length >=lower_standard && upper_standard >= length;
    }

    async fetch(response) {
        let fetch_uris = this.readUrisFromReponse(response);
        let results = await this.doWork(fetch_uris);
        results = results.unique();
        return results
    }

    readUrisFromReponse(response){
        if(typeof response !== "string") {
            return [];
        }
        return response.match(this.imgRegExp) || [];
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

module.exports = ImageFetcher;