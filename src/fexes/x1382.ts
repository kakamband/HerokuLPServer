import * as g                           from '../types/genetics'

// -- =====================================================================================

const DNA = require( '../../db/DNA/DNAx1382.json' ) as g.gene[];

// -- =====================================================================================

export function new_gene ( userId: string, ribosomeCode: string ): Promise<g.gene> {

    return new Promise ( (rs, rx) => { 
        
        a_good_gene_for_user( userId, ribosomeCode )
        .then( gene => rs( gene ) )
        .catch( err => rx( err ) );
    
    } );

}

// -- =====================================================================================

function a_good_gene_for_user ( userId: string, ribosomeCode: string ): Promise<g.gene> {

    return new Promise ( (rs, rx) => {
        
        user_needs_these( userId, ribosomeCode )
        .then( ids => { 
            // .. get first suitable gene
            let id = ids[0];
            let gene = { id: id, ...DNA[ id ] };
            rs( gene );
        } )
        .catch( err => rx(err) )
    
    } );

}

// -- =====================================================================================

function user_needs_these ( userId: string, ribosomeCode: string ): Promise<number[]> {

    return new Promise ( (rs, rx) => {
        // .. retrieve user history
        // .. retrieve 
        rs ( [7,10] );
    } );

}

// -- =====================================================================================

export function junk (): Promise<g.junk> {

    return new Promise ( (rs, rx) => { 
        
        let junk: g.junk;

        junk = {
            institute: "de",
            type: "audio",
            level: "B1",
            hPath: [ "Das sagt man so!" ],
            vPath: null,
            uPath: null,
            status: "reading",
        };

        rs( junk )
    
    } );

}