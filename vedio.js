var needle = require('needle');
var path = require('path');
var fs = require('fs');

function readBigFileEntry(filename, response) { 
    fs.exists(filename, function(exists) { 
    if (!filename || !exists) { 
        response.writeHead(404); 
        response.end(); 
        return; 
    } 
     
    var readStream = fs.ReadStream(filename); 
     
    var contentType = 'none'; 
    var ext = path.extname(filename); 
    switch (ext) { 
        case ".flv": 
            contentType = "video/flv"; 
            break; 
        case '.mp4':
            contentType = 'video/mp4';
            break;
    } 
     
    response.writeHead(200, { 
        'Content-Type' : contentType, 
        'Accept-Ranges' : 'bytes', 
        'Server' : 'Microsoft-IIS/7.5', 
        'X-Powered-By' : 'ASP.NET'
    }); 
     
    readStream.on('close', function() { 
        response.end(); 
            console.log("Stream finished."); 
        }); 
        readStream.pipe(response); 
    }); 
}
needle('get', '//v3-tt.ixigua.com/742f86ec11e4fb98ce29437a1c3c7e9a/5c36110e/video/m/2208782299f37c842dbb39a5d4909c682051142a370000129549026e2c/?rc=ZTMzaGZmZ2dnZGc5ZDxoaEApQHRAbzY8OTc6MzQzMzY0NTMzNDVvQGgzdSlAZjN1KWRzcmd5a3VyZ3lybHh3ZjM0QDJgMTJfLzM1YjExLmNjLmFzLW8jbyMvLzIuLzEtLjAwLzYuNi06I28jOmEtcSM6YHZpXGJmK2BeYmYrXnFsOiM2Ll4%3D').then(res => {
    readBigFileEntry('demo.mp4',res.bytes);
})