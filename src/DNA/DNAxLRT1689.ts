import * as g                           from '../types/genetics'
import { get }                      from 'http';

export let DNA: g.gene[] = [];

export function DNA_maker (): Promise<g.gene[]> {

    return new Promise ( (rs, rx) => { 
        
        get( "http://www.dw.com/de/deutsch-lernen/nachrichten/s-8030", res => {

            res.setEncoding('utf8');
            
                let data = "";
                res.on( 'data', chunk => data += chunk )
                res.on( "end", () => {
                    DNA.push( { 
                        title: "======================",
                        text: data.length + "",
                        avatarURL: "--------------------",
                        mediaURL: "--------------------"
                    } );
                    rs ( DNA );
            } );

        } );
    
    } )

}