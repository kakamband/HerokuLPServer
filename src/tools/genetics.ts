import * as x1127                       from "../db/RNA/RNAx1127";
import * as x834                        from "../db/RNA/RNAx834";
import * as commonRNA                   from "../db/RNA/common";
import * as g                           from '../types/genetics'
import * as u                           from "../types/user";
import { crypto }                       from "../tools/crypto";
import { de_r }                         from "../ribosomes/de"
import { it_r }                         from "../ribosomes/it"
import { en_r }                         from "../ribosomes/en"

// -- =====================================================================================

const rpi = [ ...de_r, ...en_r, ...it_r ];

const RNA: { 
    [key: string]: { 
        gene: ( user: u.user, ribosome?: g.Ribosome ) => Promise<g.gene>
        junk: ( ribosome: g.Ribosome ) => Promise<g.junk>
    } 
} = { 
    x1127,
    x834,
    commonRNA
}

// -- =====================================================================================

export function _ribosomes ( institute: string ): Promise<g.Ribosome[]> {

    return new Promise ( (rs, rx) => {
        
        let list = rpi.filter( ribosome => ribosome.institute === institute );
        
        for ( let item of list ) 
            if ( !item.contains )
                item.contains = require( "../DNA/" + item.code ).DNA.length;

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

function new_cell ( ribosome: g.Ribosome, user: u.user ): Promise<g.cell> {

    return new Promise ( (rs, rx) => {
        
        // .. insufficient data
        if ( !ribosome.code ) return rx( "Entry mismatched!" );
        
        // .. RNA parser allocating
        let rCode: string;
        if      ( ribosome.code === "NACHRIT" ) rCode = "x1127";
        else if ( ribosome.code === "TPTHEMA" ) rCode = "x834";
        else rCode = "commonRNA";
        
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


    } )

}

// -- =====================================================================================
