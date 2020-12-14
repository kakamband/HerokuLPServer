import * as g                           from '../../types/genetics'
import * as u                           from "../../types/user";
import { a_good_gene_4_user }           from "../../tools/user";

// -- =====================================================================================

export function gene ( user: u.user, ribosome: g.Ribosome ): Promise<g.gene> {

    return new Promise ( (rs, rx) => { 
        
        let DNA = require( "../DNA/" + ribosome.code ).DNA;
        let ABC = require( "../DNA/" + ribosome.code ).ABC;

        a_good_gene_4_user( user, DNA, ribosome.readMode )
        .then( gene => rs( { ...gene, initSnaps: [ ...ABC, ...gene.initSnaps || [] ] } ) )
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

