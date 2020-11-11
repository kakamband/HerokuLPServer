import * as g                           from '../types/genetics'
import { request }                      from 'http';

export let DNA: g.gene[] = [];

export function DNA_maker (): Promise<g.gene[]> {

    return new Promise ( (rs, rx) => { 

        const req = request(
            {
              host: 'jsonplaceholder.typicode.com',
              path: '/todos/1',
              method: 'GET',
            },
            response => {
                DNA.push( { title: "test", text: "response", avatarURL: null, mediaURL: null } );
                rs ( DNA );
                console.log(response.statusCode); // 200
            }
          );
           
          req.end();
    
    } )


    
}