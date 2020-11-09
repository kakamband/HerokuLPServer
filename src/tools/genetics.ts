import * as fexes                       from "../fexes/fexes";
import * as g                           from '../types/genetics'
import * as u                           from "../types/user";

// -- =====================================================================================

const ribosomeToFex = require( "../../db/ribosome/ribosomeToFex.json" );

// -- =====================================================================================

function gene ( ribosomeCode: string, user: u.user ): Promise<g.gene>{

    return new Promise ( (rs, rx) => {

        // .. insufficient data
        if ( !ribosomeCode || !user ) return rx( "Entry mismatched!" );
        
        let fex = ribosomeToFex[ ribosomeCode ];

        if ( fex ) {
            
            // .. fex has been found
            if ( fexes.new_gene.hasOwnProperty( fex ) ) {
                fexes.new_gene[ fex ]( ribosomeCode, user )
                .then( gene => rs( gene ) )
                .catch( err => rx( err ) );
            }
            // .. this fex is not coded yet!
            else return rx( "fex error!" );
            
        }
        // .. no fex no way
        else return rx( "FexCode mismatched!" );

    } )

}

// -- =====================================================================================

function junk ( ribosomeCode: string ): Promise<g.junk>{

    return new Promise ( (rs, rx) => {

        // .. insufficient data
        if ( !ribosomeCode ) return rx( "Entry mismatched!" );
        
        let fex = ribosomeToFex[ ribosomeCode ];

        if ( fex ) {
            
            // .. fex has been found
            if ( fexes.junk.hasOwnProperty( fex ) ) {
                fexes.junk[ fex ]()
                .then( junk => rs( junk ) )
                .catch( err => rx( err ) );
            }
            // .. this fex is not coded yet!
            else return rx( "fex error!" );
            
        }
        // .. no fex no way
        else return rx( "FexCode mismatched!" );

    } )

}

// -- =====================================================================================

function cell ( ribosomeCode: string, gene: g.gene, junk:g.junk ): g.cell {

    return {
                                             
        chromosome: {                        
            title           : gene.title    ,
            code            : {              
                ribosome    : ribosomeCode  ,
                idx         : gene.id       ,
                name        : null          ,
            }                               ,
            ...junk                         ,
            wPath           : {              
                avatarURL   : gene.avatarURL,
                mediaURL    : gene.mediaURL ,
            }                                
        }                                   ,
                                             
        context             : [ gene.text ] ,
                                             
    }

}

// -- =====================================================================================

// TODO define return type!!!
function _new_cell ( ribosomeCode: string, user: u.user ): Promise<g.cell> {
    
    return new Promise( async (rs, rx) => {

        let requiredData: any[] = [
            gene ( ribosomeCode, user ),
            junk ( ribosomeCode ),
        ] 

        Promise.all( requiredData )
        .then( allData => rs ( cell( ribosomeCode, allData[0], allData[1] ) ) )
        .catch( err => rx(err) );

     } );

}

// -- =====================================================================================

export function _crypto_cell ( ribosomeCode: string, user: u.user ): Promise<g.cryptoCell>{
    
    return new Promise( async (rs, rx) => {
        
        _new_cell( ribosomeCode, user )
        .then( cell => {
            // rs ( JSON.stringify( cell ) );
            rs ( { id: cell.chromosome.code.idx , cell: cell } );
        } )
        .catch( err => rx(err) );
    
    } );

}