
const DNA = require( '../../src/db/DNA/DNAx1382.json' ) as {title: string}[];

// -- =====================================================================================

export function new_gene (): Promise<{title: string}> {

    return new Promise ( (rs, rx) => { 
        
        retrieveGoodGene().then( gene => rs( gene ) )
        .catch( err => rx( "not found dor some reason!" ) );
    
    } );

}

// -- =====================================================================================

export function retrieveGoodGene () {
    return Promise.resolve( DNA[0] );
}

// -- =====================================================================================
