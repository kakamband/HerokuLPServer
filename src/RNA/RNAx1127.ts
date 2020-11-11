import * as g                           from '../types/genetics'
import * as u                           from "../types/user";
import { a_good_gene_4_user }           from "../tools/user";
import { DNA_maker }                    from "../DNA/DNAxLRT1689";

// -- =====================================================================================

export function gene ( ribosomeCode: string, user: u.user ): Promise<g.gene> {

    return new Promise ( (rs, rx) => { 

        DNA_maker().then( DNA => { 
            
            a_good_gene_4_user( ribosomeCode, user, DNA, "end" )
            .then( gene => rs( gene ) )
            .catch( err => rx( err ) );
        
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
            level       : "C1"                  ,
            hPath       : [ "Nachrichten" ]     ,
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
        snap.a = "14";
        snap.b = "14";
        rs( snap )
    } );

}

// -- =====================================================================================

