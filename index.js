#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var mkdirp = require('mkdirp');

module.exports = function(params){
    var PORT = (params && params.port) || 8999;

    var server = http.createServer(function (req, res) {
        
        function error(err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end(err.toString()); //fail
        }

        function next(from, to) {
            fs.readFile(from, function (err, content) {
                if (err) {
                    error(err);
                } else {
                    fs.writeFile(to, content, function (err) {
                        if (err) {
                            error(err);
                        }
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end('0'); //success
                    });
                }
            });
        }

        if (req.url == '/') {
            res.writeHead(200, {'content-type': 'text/html'});
            res.end('I\'m ready for that, you know.');
        } else if (req.url == '/receiver' && req.method.toLowerCase() == 'post') {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (err) {
                    error(err);
                } else {
                    var to = fields['to'].replace(/\\/g,path.sep);
                    fs.exists(to, function (exists) {
                        if (exists) {
                            fs.unlink(to, function (err) {
                                next(files.file.path, to); 
                            });
                        } else {
                            fs.exists(path.dirname(to), function (exists) {
                                if (exists) {
                                    next(files.file.path, to); 
                                } else {
                                    mkdirp(path.dirname(to), 0777, function (err) {
                                        if (err) {
                                            error(err);
                                            return;
                                        }
                                        next(files.file.path, to); 
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    server.listen(PORT, function () {
        console.log('receiver listening:' + PORT);
    });
}
