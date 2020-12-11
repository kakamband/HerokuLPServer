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
            if ( !item.contains )
                item.contains = require( "../DNA/DNAx" + item.code ).DNA.length;

        rs ( list );

    } )

}

// -- =====================================================================================

export function _crypto_cell (

    ribCode: string, 
    user: u.user, 
    keyString: string 

): Promise<{ id: string, cryptoCell: string }> {
    
    return new Promise( async (rs, rx) => {
        
        let id = rpi.findIndex( row => row.code === ribCode );
        
        // .. very odd Error!
        if ( id === -1 ) return rx( "Ribosome Not Found!" );
        
        let ribosome = rpi[ id ];

        new_cell( ribosome, user ).
            then( cell => rs ( {
                id: cell.chromosome.code.idx,
                cryptoCell: crypto( JSON.stringify( cell ), keyString )
            } ) ).
            catch( err => rx(err) );
    
    } );

}

// -- =====================================================================================

function cell ( ribosome: g.Ribosome, gene: g.gene, junk:g.junk ): Promise<g.cell> {

    return new Promise ( (rs, rx) => {

        let cellText = gene.text;
        // if ( !gene.text && !!gene.isYouTube ) cellText = 

        rs ( {
                                                             
            chromosome: {                                    
                title           : gene.title                ,
                code            : {                          
                    ribosome    : ribosome.code             ,
                    idx         : gene.id                   ,
                }                                           ,
                ...junk                                     ,
                hPath           : [                          
                    ribosome.title.replace( /\n/g, ' ' )    ,
                    ...gene.hPath || []                      
                ]                                           ,
                vPath           : [ gene.title ]            ,
                wPath           : {                          
                    avatarURL   : gene.avatarURL            ,
                    avatar_C    : !!gene.avatar_C           ,
                    mediaURL    : gene.mediaURL             ,
                    media_C     : !!gene.media_C            ,
                }                                           ,
                isYouTube       : !!gene.isYouTube          ,
                snaps           : gene.snaps                ,
            }                                               ,
                                                             
            rawText             : cellText                  ,
                                                             
                                                             
        } );

    } );

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
                ] as [ 
                    Promise<g.gene>,
                    Promise<g.junk>,
                ]
        
                Promise.all( requiredData ).
                then( i => cell( ribosome, i[0], i[1] ) ).
                then( cell => rs( cell ) ).
                catch( err => rx(err) );

            }
            // .. this rRNA is not coded yet!
            else return rx( "rRNA error!" );

        }
        // .. no rRNA no way
        else return rx( "rRNA mismatched!" );

    } )

}

// -- =====================================================================================
