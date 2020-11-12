import * as g                           from '../types/genetics'
import * as u                           from "../types/user";
import { DNA_maker }                    from "../DNA/DNAxLRT1689";

// -- =====================================================================================

export function gene ( user: u.user ): Promise<g.gene> {

    return new Promise ( (rs, rx) => { 

        DNA_maker()
        .then( DNA => {
            if ( !user.gotFromThisRibosome.includes( DNA[0].id ) ) rs( DNA[0] );
            else rx( "No more News for Today!" );
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

export function snap (): Promise<{ [key: string]: string }> {

    return new Promise ( (rs, rx) => { 
        let snap = {} as { [key: string]: string };
        snap.a = "14";
        snap.b = "14";
        rs( snap )
    } );

}

// -- =====================================================================================

