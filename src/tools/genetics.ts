import * as fexes                       from "../fexes/fexes";

// -- =====================================================================================

const ribosomeToFex = require( "../db/ribosome/ribosomeToFex.json" );

// -- =====================================================================================

export function gene ( ribosomeCode: string, userId: string ): Promise<{ title: string; }>{

    return new Promise ( (rs, rx) => {

        // .. insufficient data
        if ( !ribosomeCode || !userId ) return rx( "Entry mismatched!" );
        
        if ( ribosomeToFex[ ribosomeCode ] ) {
            
            // .. fex has been found
            if ( fexes.new_gene.hasOwnProperty( ribosomeToFex[ ribosomeCode ] ) ) {
                fexes.new_gene.x1382.then( gene => rs( gene ) )
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
