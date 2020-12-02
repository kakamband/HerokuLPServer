import * as g                           from '../types/genetics'
import * as u                           from "../types/user";
import { a_good_gene_4_user }           from "../tools/user";

// -- =====================================================================================

export function gene ( user: u.user, ribosome: g.Ribosome ): Promise<g.gene> {

    return new Promise ( (rs, rx) => { 
        
        let DNA = require( "../DNA/DNAx" + ribosome.code ).DNA;

        a_good_gene_4_user( user, DNA, ribosome.readMode )
        .then( gene => rs( gene ) )
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

export function snap (): Promise<{ [key: string]: string }> {

    return new Promise ( (rs, rx) => { 
        let snap = {} as { [key: string]: string };
        snap.a = "10";
        snap.b = "10";
        rs( snap )
    } );

}

// -- =====================================================================================
