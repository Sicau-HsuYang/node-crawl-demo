var needle = require('needle');
var fs = require('fs');
var fileManager = require('../helpers/file-manager');
class ImageFetcher {
    constructor(){
        this.imgRegExp = /((http(s)?)|(ftp):)?\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?\.((png)|(jp(e)?g)|(gif))/g
    }

    async fetch(response) {
        let fetch_uris = this.readUrisFromReponse(response);
        let results = await this.doWork(fetch_uris);
        return results;
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
        needle('get', src).then(response => {
            response.setEncoding('binary');
            let filename = fileManager.getFileName(src);
            let save_path = fileManager.getSavePath(filename);
            return fileManager.createFile(save_path, response.raw);
        });
    }
}

module.exports = ImageFetcher;