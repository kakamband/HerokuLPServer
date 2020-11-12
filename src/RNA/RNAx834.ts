import * as g                           from '../types/genetics'
import * as u                           from "../types/user";
import { DNAxList, DNA_maker }          from "../DNA/DNAxTTFGH8V";

// -- =====================================================================================

export function gene ( user: u.user ): Promise<g.gene> {

    return new Promise ( (rs, rx) => { 

        DNAxList().then( list => {

            // .. filter list to new ones for user
            list = list.filter( item => !user.gotFromThisRibosome.includes( item.id ) );
            
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

export function junk ( ribosome: g.Ribosome ): Promise<g.junk> {

    return new Promise ( (rs, rx) => { 
        
        let junk: g.junk;

        junk = {
            institute   : ribosome.institute    ,
            type        : ribosome.type         ,
            level       : ribosome.level        ,
            hPath       : [ ribosome.title ]    ,
            vPath       : [ ribosome.title ]    ,
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

export function snap (): Promise<{ [key: string]: string }> {

    return new Promise ( (rs, rx) => { 
        let snap = {} as { [key: string]: string };
        snap.a = "12";
        snap.b = "12";
        rs( snap )
    } );

}

// -- =====================================================================================

