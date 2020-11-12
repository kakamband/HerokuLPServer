import * as g                           from '../types/genetics'
import * as u                           from "../types/user";
import { DNAxList, DNA_maker }          from "../DNA/DNAxTTFGH8V";

// -- =====================================================================================

export function gene ( ribosomeCode: string, user: u.user ): Promise<g.gene> {

    return new Promise ( (rs, rx) => { 

        DNAxList().then( list => {

            // .. filter list to new ones for user
            list = list.filter( item => !user.gotLessons.includes( item.id ) );
            
            if ( !list.length ) rx( "No more Thema for now!" );
        
            else {
                DNA_maker( list[0].id ,list[0].link )
                .then( DNA => rs( DNA[0] ) )
                .catch( err => rx( err ) );
            };
        
        } )
        .catch( err => rx( err ) );
    
    } );

}

// -- =====================================================================================

export function junk ( ribosomeCode: string ): Promise<g.junk> {

    return new Promise ( (rs, rx) => { 
        
        let junk: g.junk;

        junk = {
            institute   : "de"                  ,
            type        : "audio"               ,
            level       : "B1"                  ,
            hPath       : [ "Top Thema" ]       ,
            vPath       : null                  ,
            uPath       : {                      
                context : null                  ,
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

export function snap ( ribosomeCode: string ): Promise<{ [key: string]: string }> {

    return new Promise ( (rs, rx) => { 
        let snap = {} as { [key: string]: string };
        snap.a = "12";
        snap.b = "12";
        rs( snap )
    } );

}

// -- =====================================================================================

