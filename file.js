const http = require('https');

const userAgent  = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0";



    http.get( "https://www.dw.com/de/deutsch-lernen/nachrichten/s-8030", function (res) {
      res.setEncoding('utf8');
      var data = "";
      res.on('data', function (chunk) {
          data += chunk;
      });
      res.on("end", function () {
          console.log(data);
      });
  });
  