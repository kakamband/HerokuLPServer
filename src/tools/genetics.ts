import { RNA }                          from "../RNA/RNA";
import * as g                           from '../types/genetics'
import * as u                           from "../types/user";
import { ribosomeToRNA }                from "../ribosomes/rRNA";
import { rpi }                          from "../ribosomes/rpi";

// -- =====================================================================================

function 
cell ( ribosome: g.Ribosome, gene: g.gene, junk:g.junk, snap: g.rawSnap ): g.cell {

    // .. concat category
    if ( gene.hPath ) junk.hPath = [ ...junk.hPath, ...gene.hPath ];
    
    return {
                                                 
        chromosome: {                            
            title           : gene.title        ,
            code            : {                  
                ribosome    : "ribosome.code"     ,
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
function _new_cell ( ribosome: g.Ribosome, user: u.user ): Promise<g.cell> {

    return new Promise ( (rs, rx) => {
        
        // .. insufficient data
        if ( !ribosome.code ) return rx( "Entry mismatched!" );
        
        let rCode = ribosomeToRNA[ ribosome.code ];
        
        if ( rCode ) {
            
            // .. rRNA has been found
            if ( RNA.hasOwnProperty( rCode ) ) {
                
                let requiredData = [
                    RNA[ rCode ].gene( user, ribosome ),
                    RNA[ rCode ].junk( ribosome ),
                    RNA[ rCode ].snap(),
                ] as [ 
                    Promise<g.gene>,
                    Promise<g.junk>,
                    Promise<g.rawSnap>
                ]
        
                Promise.all( requiredData )
                .then( i => rs ( cell( ribosome, i[0], i[1], i[2] ) ) )
                .catch( err => rx(err) );

            }
            // .. this rRNA is not coded yet!
            else return rx( "rRNA error!" );

        }
        // .. no rRNA no way
        else return rx( "rRNA mismatched!" );

    } )

}

// -- =====================================================================================

export function _crypto_cell ( ribCode: string, user: u.user ): Promise<g.cryptoCell> {
    
    return new Promise( async (rs, rx) => {
        
        let id = rpi.findIndex( row => row.code === ribCode );
        
        // .. very odd Error!
        if ( id === -1 ) return rx( "Ribosome Not Found!" );
        
        let ribosome = rpi[ id ];

        _new_cell( ribosome, user )
        .then( cell => {
            rs ( { id: cell.chromosome.code.idx , cell: cell } );
        } )
        .catch( err => rx(err) );
    
    } );

}