import { RNA }                          from "../RNA/RNA";
import * as g                           from '../types/genetics'
import * as u                           from "../types/user";
import { crypto }                       from "../tools/crypto";
import { ribosomeToRNA }                from "../ribosomes/rRNA";
import { rpi }                          from "../ribosomes/rpi";

// -- =====================================================================================

export function _ribosomes ( institute: string ): Promise<g.Ribosome[]> {

    return new Promise ( (rs, rx) => {
        
        let list = rpi.filter( ribosome => ribosome.institute === institute );
        
        for ( let item of list ) 
            item.contains = require( "../DNA/DNAx" + item.code ).DNA.length;

        rs ( list );

    } )

}

// -- =====================================================================================

export function _crypto_cell ( ribCode: string, user: u.user ): Promise<string> {
    
    return new Promise( async (rs, rx) => {
        
        let id = rpi.findIndex( row => row.code === ribCode );
        
        // .. very odd Error!
        if ( id === -1 ) return rx( "Ribosome Not Found!" );
        
        let ribosome = rpi[ id ];

        new_cell( ribosome, user ).
            then( cell => rs ( crypto( JSON.stringify( cell ), user.currentDevice ) ) ).
            catch( err => rx(err) );
    
    } );

}

// -- =====================================================================================

function cell ( ribosome: g.Ribosome, gene: g.gene, junk:g.junk, snap: g.rawSnap ): g.cell {

    return {
                                                 
        chromosome: {                            
            title           : gene.title                ,
            code            : {                          
                ribosome    : ribosome.code             ,
                idx         : gene.id                   ,
                name        : null                      ,
            }                                           ,
            ...junk                                     ,
            hPath           : [                          
                ribosome.title.replace( /\n/g, ' ' )    ,
                ...gene.hPath || []                      
            ]                                           ,
            vPath           : [ gene.title ]            ,
            wPath           : {                          
                avatarURL   : gene.avatarURL            ,
                mediaURL    : gene.mediaURL             ,
            }                                            
        }                                               ,
                                                         
        rawText             : gene.text                 ,
                                                         
        rawSnap             : snap                      ,
                                                 
    }

}

// -- =====================================================================================

// TODO define return type!!!
function new_cell ( ribosome: g.Ribosome, user: u.user ): Promise<g.cell> {

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