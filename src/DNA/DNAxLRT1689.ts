import * as g                           from '../types/genetics'
import { get }                      from 'https';

export let DNA: g.gene[] = [];

export function DNA_maker (): Promise<g.gene[]> {

    return new Promise ( (rs, rx) => { 
        
        get( "https://www.dw.com/en/top-stories/s-9097", res => {

            res.setEncoding('utf8');
            
                let data = "";
                res.on( 'data', chunk => data += chunk )
                res.on( "end", () => {
                    DNA.push( { 
                        title: "======================",
                        text: data,
                        avatarURL: "--------------------",
                        mediaURL: "--------------------"
                    } );
                    rs ( DNA );
            } );

        } );
    
    } )

}