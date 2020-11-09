import * as g                           from '../types/genetics'
import * as u                           from "../types/user";

// -- =====================================================================================

const DNA = require( '../../db/DNA/DNAx1382.json' ) as g.gene[];

// -- =====================================================================================

export function new_gene ( ribosomeCode: string, user: u.user ): Promise<g.gene> {

    return new Promise ( (rs, rx) => { 
        
        a_good_gene_for_user( ribosomeCode, user )
        .then( gene => rs( gene ) )
        .catch( err => rx( err ) );
    
    } );

}

// -- =====================================================================================

function a_good_gene_for_user ( ribosomeCode: string, user: u.user ): Promise<g.gene> {

    return new Promise ( (rs, rx) => {
        
        user_needs_these( ribosomeCode, user )
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

function user_needs_these ( ribosomeCode: string, user: u.user ): Promise<number[]> {

    return new Promise ( (rs, rx) => {

        let list = [];
    
        // .. create list
        for ( let i=0; i < DNA.length; i++ ) list.push(i);
    
        // .. first Meet: return result
        if ( !user.purchased_items ) return rs ( list );
            
        // .. trim list
        user.purchased_items = JSON.parse( user.purchased_items as any );
        if ( user.purchased_items.hasOwnProperty( ribosomeCode ) ) {
            list = list.filter( i => !user.purchased_items[ ribosomeCode ].includes(i) );
        }

        // .. return result
        return list.length ? rs( list ) : rx( "no more lesson" );
    
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