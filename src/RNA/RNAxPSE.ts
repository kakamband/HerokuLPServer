import * as g                           from '../types/genetics'
import * as u                           from "../types/user";

// -- =====================================================================================

export function gene ( user: u.user ): Promise<g.gene> {

    return new Promise ( (rs, rx) => { 
        
        let DNA = require( "../DNA/DNAxPSE" ).DNA;

        rs( DNA[0] );
    
    } );

}

// -- =====================================================================================

export function junk ( ribosome: g.Ribosome ): Promise<g.junk> {

    return new Promise ( (rs, rx) => { 
        
        let junk: g.junk;

        junk = {
            institute   : ribosome.institute    ,
            type        : ribosome.type         ,
            level       : ribosome.level        ,
            vPath       : null                  ,
            uPath       : {                      
                media   : null                  ,
                avatar  : null                  ,
            }                                   ,
            status      : "reading"             ,
            etikett     : {}                    ,
        };

        rs( junk )
    
    } );

}

// -- =====================================================================================

export function snap (): Promise<{ [key: string]: string }> {

    return new Promise ( (rs, rx) => { 
        let snap = {} as { [key: string]: string };
        snap.a = "10";
        snap.b = "10";
        rs( snap )
    } );

}

// -- =====================================================================================

