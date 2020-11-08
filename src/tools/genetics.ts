import * as fexes                      from "../fexes/fexes";
import * as g                          from '../types/genetics'

// -- =====================================================================================

const ribosomeToFex = require( "../../db/ribosome/ribosomeToFex.json" );

// -- =====================================================================================

function gene ( ribosomeCode: string, userId: string ): Promise<g.gene>{

    return new Promise ( (rs, rx) => {

        // .. insufficient data
        if ( !ribosomeCode || !userId ) return rx( "Entry mismatched!" );
        
        let fex = ribosomeToFex[ ribosomeCode ];

        if ( fex ) {
            
            // .. fex has been found
            if ( fexes.new_gene.hasOwnProperty( fex ) ) {
                fexes.new_gene[ fex ]( userId, ribosomeCode )
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

function cell ( gene: g.gene, junk:g.junk ): { "chromosome": g.Chromosome, "context": any } {

    return {
        chromosome: {
            ...junk,
            title   : gene.title,
            id      : gene.id,
            wPath   : {
                avatarURL: gene.avatarURL,
                mediaURL: gene.mediaURL,
            }
        },
        context: [ gene.text ] 
    }

}

// -- =====================================================================================

// TODO define return type!!!
function _new_cell ( ribosomeCode: string, userId: string ) {
    
    return new Promise( async (rs, rx) => {

        let requiredData: any[] = [
            gene ( ribosomeCode, userId ),
            junk ( ribosomeCode ),
        ] 

        Promise.all( requiredData )
        .then( allData => rs ( cell( allData[0], allData[1] ) ) )
        .catch( err => rx(err) );

     } );

}

// -- =====================================================================================

export function _crypto_cell ( ribosomeCode: string, userId: string ) {
    
    return new Promise( async (rs, rx) => {
        
        _new_cell( ribosomeCode, userId )
        .then( cell => {
            // rs ( JSON.stringify( cell ) );
            rs ( cell );
        } )
        .catch( err => rx(err) );
    
    } );

}