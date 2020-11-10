import { fexes }                        from "../fexes/fexes";
import * as g                           from '../types/genetics'
import * as u                           from "../types/user";
import { ribosomeToFex }                from "../ribosomes/ribosomeToFex";

// -- =====================================================================================

function 
cell ( ribosomeCode: string, gene: g.gene, junk:g.junk, snap: g.rawSnap ): g.cell {

    // .. concat category
    if ( gene.hPath ) junk.hPath = [ ...junk.hPath, ...gene.hPath ];
    
    return {
                                                 
        chromosome: {                            
            title           : gene.title        ,
            code            : {                  
                ribosome    : ribosomeCode      ,
                idx         : gene.id           ,
                name        : null              ,
            }                                   ,
            ...junk                             ,
            wPath           : {                  
                avatarURL   : gene.avatarURL    ,
                mediaURL    : gene.mediaURL     ,
            }                                    
        }                                       ,
                                                 
        rawText             : gene.text         ,
                                                 
        rawSnap             : snap              ,
                                                 
    }

}

// -- =====================================================================================

// TODO define return type!!!
function _new_cell ( ribosomeCode: string, user: u.user ): Promise<g.cell> {

    return new Promise ( (rs, rx) => {

        // .. insufficient data
        if ( !ribosomeCode ) return rx( "Entry mismatched!" );

        let fex = ribosomeToFex[ ribosomeCode ];

        if ( fex ) {

            // .. fex has been found
            if ( fexes.hasOwnProperty( fex ) ) {
               
                let requiredData = [
                    fexes[ fex ].gene( ribosomeCode, user ),
                    fexes[ fex ].junk( ribosomeCode ),
                    fexes[ fex ].snap( ribosomeCode ),
                ] as [ 
                    Promise<g.gene>,
                    Promise<g.junk>,
                    Promise<g.rawSnap>
                ]
        
                Promise.all( requiredData )
                .then( i => rs ( cell( ribosomeCode, i[0], i[1], i[2] ) ) )
                .catch( err => rx(err) );

            }
            // .. this fex is not coded yet!
            else return rx( "fex error!" );

        }
        // .. no fex no way
        else return rx( "FexCode mismatched!" );

    } )

}

// -- =====================================================================================

export function 
_crypto_cell ( ribosomeCode: string, user: u.user ): Promise<g.cryptoCell> {
    
    return new Promise( async (rs, rx) => {
        
        _new_cell( ribosomeCode, user )
        .then( cell => {
            // rs ( JSON.stringify( cell ) );
            rs ( { id: cell.chromosome.code.idx , cell: cell } );
        } )
        .catch( err => rx(err) );
    
    } );

}