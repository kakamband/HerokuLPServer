import * as g                           from '../types/genetics'
import * as u                           from "../types/user";
import { DNAxList, DNA_maker, ABC }     from "../DNA/DNAxTPTHEMA";

// -- =====================================================================================

export function gene ( user: u.user ): Promise<g.gene> {

    return new Promise ( (rs, rx) => { 

        DNAxList().then( list => {

            // .. filter list to new ones for user
            list = list.filter( item => !user.gotFromThisRibosome.includes( item.id ) );
            
            if ( !list.length ) rx( "No more Thema for now!" );
        
            else {
                DNA_maker( list[0].id ,list[0].link )
                .then( DNA => rs( { ...DNA[0], snaps: [ ...ABC ] } ) )
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
