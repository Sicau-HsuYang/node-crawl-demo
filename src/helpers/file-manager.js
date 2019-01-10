const fs = require('fs');
const path = require('path');
const config = require('../config/index');
class fileManager {

    createFile(save_path, bytes){
        return new Promise((resolve, reject) => {
            fs.writeFile(save_path, bytes, "binary", function(err) {
                if(err) {
                    reject(err.message);
                }
                resolve(save_path);
            });
        });
    }

    getSavePath(filename){
        let demo_path = path.resolve(__dirname, `../../${config.SAVE_PATH}`)+filename;
        return path.resolve(__dirname, `../../${config.SAVE_PATH}`)+"/"+filename;
    }

    getFileName (str) {
        if (typeof str !== "string") return null;
        var lastIndex = str.lastIndexOf('/');
        return str.substr(lastIndex+1);
    };

    /**
     * 读取路径信息
     * @param {string} path 路径
     */
    getStat (path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if(err){
                    resolve(false);
                }else{
                    resolve(stats);
                }
            })
        })
    }

    /**
     * 创建路径
     * @param {string} dir 路径
     */
    mkdir(dir){
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, err => {
                if(err){
                    resolve(false);
                }else{
                    resolve(true);
                }
            })
        })
    }

    /**
     * 路径是否存在，不存在则创建
     * @param {string} dir 路径
     */
    async dirExists (dir) {
        let isExists = await this.getStat(dir);
        //如果该路径且不是文件，返回true
        if(isExists && isExists.isDirectory()){
            return true;
        }else if(isExists){     //如果该路径存在但是文件，返回false
            return false;
        }
        //如果该路径不存在
        let tempDir = path.parse(dir).dir;      //拿到上级路径
        //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
        let status = await this.dirExists(tempDir);
        let mkdirStatus;
        if(status){
            mkdirStatus = await this.mkdir(dir);
        }
        return mkdirStatus;
    }
    
}

module.exports = new fileManager();