const http = require('https');



http.get( "https://www.dw.com/de/deutsch-lernen/nachrichten/s-8030", res => {
    res.setEncoding('utf8');
        let data = "";
        res.on( 'data', chunk => data += chunk )
        res.on( "end", () => {
        console.log(data);
    } );
} );
