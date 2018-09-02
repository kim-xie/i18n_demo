let http = require("http");
let fs = require("fs");
let path = require('path');
let url = require('url');
let mine = require('./mine').types;

// 创建http服务
http.createServer(function(req, res){
  var hasExt = true;
  var pathName = url.parse(req.url).pathname;

  // 对请求的路径进行解码，防止中文乱码
  pathName = decodeURI(pathName);

  // 如果路径中没有扩展名
  if (path.extname(pathName) === '') {
      // 如果不是以/结尾的，加/并作301重定向
      if (pathName.charAt(pathName.length-1) != '/'){
          pathName += '/';
          var redirect = 'http://' + req.headers.host + pathName;
          res.writeHead(301, {
              location: redirect
          });
          res.end();
          return ;
      }else{
        // 添加默认的访问页面,但这个页面不一定存在,后面会处理
        pathName += 'index.html';
        hasExt = false; // 标记默认页面是程序自动添加的
      }
  }

  // 获取资源文件的相对路径
  var filePath = path.join('i18n_demo', '../'+pathName);
  //console.log(filePath)
  // 获取对应文件的文档类型
  var ext = path.extname(pathName);
  ext = ext ? ext.slice(1) : 'unknown';
  var contentType = mine[ext] || "text/plain";
  //console.log(contentType)
  // 如果文件名存在
  fs.access(filePath, function(exists) {
      if (exists) {
          // binary二进制读取图片
          if(contentType.indexOf('gif')!=-1 || contentType.indexOf('png')!=-1){
            readImg(path.join(__dirname, '../'+pathName),res);
          }else{
            fs.readFile(path.join(__dirname, '../'+pathName), {
              flag: 'r+',
              encoding: 'utf8'
            }, function (err, data) {
              if(err) {
                  console.error(err);
                  res.writeHead(500, {'content-type': 'text/html'});
                  res.end('<h1>500 Server Error</h1>');
                  return;
              }else{
                res.writeHead(200, {'content-type': contentType});
                res.end(data);
              }
            });
          }
      } else { // 文件名不存在的情况
          if (hasExt) {
              // 如果这个文件不是程序自动添加的，直接返回404
              res.writeHead(404, {'content-type': 'text/html'});
              res.end('<h1>404 Not Found</h1>');
          } else {
              // 如果文件是程序自动添加的且不存在，则表示用户希望访问的是该目录下的文件列表
              var html = "<head><meta charset='utf-8'></head>";
              try {
                  // 用户访问目录
                  var filedir = filePath.substring(0, filePath.lastIndexOf('\\'));
                  // 获取用户访问路径下的文件列表
                  var files = fs.readdirSync(filedir);
                  // 将访问路径下的所以文件一一列举出来，并添加超链接，以便用户进一步访问
                  for (var i in files) {
                      var filename = files[i];
                      html += "<div><a  href='" + filename + "'>" + filename + "</a></div>";
                  }
              } catch (e){
                  html += '<h1>您访问的目录不存在</h1>';
              }
              res.writeHead(200, {'content-type': 'text/html'});
              res.end(html);
          }
      }
  });
}).listen(8888, function() {
    console.log('[HttpServer][Start]', 'runing at port 8888/');
});

// 读取图片
function readImg(path,res){
  fs.readFile(path,'binary',function(err,file){
      if(err){
          console.log(err);
          return ;
      }else{
          res.write(file,'binary');
          res.end();
      }
  });
}
