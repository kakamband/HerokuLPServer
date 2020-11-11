import * as g                           from '../types/genetics'
import { request }                      from 'http';

export let DNA: g.gene[] = [];

export function DNA_maker (): Promise<g.gene[]> {

    return new Promise ( (rs, rx) => { 

        
        const req = request(
            {
              host: 'www.dw.com',
              path: '/de/deutsch-lernen/nachrichten/s-8030',
              method: 'GET',
            },
            response => {
                let body = "";
                response.on('readable', function() {
                    body += response.read();
                    console.log(response.read());
                    console.log(body);
                    DNA.push( { title: body, text: body, avatarURL: null, mediaURL: null } );
                    rs ( DNA );
                    
                });
                
            }
          );
           
          req.end();
    
    } )


    
}