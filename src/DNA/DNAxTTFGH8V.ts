import { html }                         from './DNAx'
import { audio_page, avatar, audio }    from './DNAxDW'
import * as g                           from '../types/genetics'

// -- =====================================================================================

export const DNA: g.gene[] = []

// -- =====================================================================================

export function DNA_maker ( id: string, link: string ): Promise<g.gene[]> {

    return new Promise ( (rs, rx) => { 

        html( link ).then( themaPage => {
            html( audio_page( themaPage ) ).then( audioPage => { 
                DNA.push( { 
                    id          : id,
                    title       : "tttt",
                    text        : text( themaPage ),
                    avatarURL   : avatar( themaPage ),
                    mediaURL    : audio( audioPage ),
                    hPath       : ["heute.hPath"] 
                } );

                rs ( DNA );
            } );
        } );
    
    } );

}

// -- =====================================================================================

export function DNAxList (): Promise< { id: string, link: string }[] > {
    
    return new Promise ( (rs, rx) => {

        let homeURL = "https://www.dw.com/de/deutsch-lernen/top-thema/s-8031";

        html( homeURL ).then( homePage => {

            let aCut: string, 
                bCut: string, 
                freshBox: string[], 
                archiveBox: string[], 
                aCutID: number, 
                bCutID: number, 
                list: { id: string, link: string }[] = [];

            // .. fresh lessons
            aCut        = '<!-- Base-Teaser -->';
            bCut        = '<!-- End Base-Teaser -->';
            aCutID      = homePage.indexOf( aCut );
            bCutID      = homePage.lastIndexOf( bCut );
            freshBox    = homePage.substring( aCutID, bCutID + bCut.length ).split( aCut );
            
            // .. archived lessons
            aCut        = '<!-- ContentList Teaser -->';
            bCut        = '<!-- END ContentList Teaser -->';
            aCutID      = homePage.indexOf( aCut );
            bCutID      = homePage.lastIndexOf( bCut );
            aCut        = '<div class="linkList plain">';
            archiveBox  = homePage.substring( aCutID, bCutID + bCut.length ).split( aCut );
            
            freshBox.shift();
            archiveBox.shift();

            for ( let item of [ ...freshBox, ...archiveBox ] ) {

                aCut    = '<a href="';
                aCutID  = item.indexOf( aCut );
                item    = item.substr( aCutID + aCut.length );
                bCut    = '">';
                bCutID  = item.indexOf( bCut );
                item  = item.substring( 0, bCutID );
                list.unshift( {
                    id: item.split("/")[2],
                    link: 'https://www.dw.com' + item
                } );

            }

            return rs( list );
        
        } );
    
    } );

} 

// -- =====================================================================================

function text ( str: string ) {
    
    let aCut: string,
        bCut: string,
        aCutID: number,
        bCutID: number,
        tmp: string;
    
    aCutID = str.search( /<div class="dkTaskWrapper tab3" [^>]+>/ );
    bCutID = str.search( /<div class="dkTaskWrapper tab4" [^>]+>/ );
    str    = str.substr( aCutID , bCutID-aCutID );
    aCut   = '<p>';
    aCutID = str.indexOf( aCut )  + aCut.length;
    str    = str.substr( aCutID );
    str    = str.replace( /<p class="dkManu">/g , '\n' );
    str    = str.replace( /<p>/g , '\n' );
    str    = str.replace( /<\/p>/g , '' );
    str    = str.replace( /<strong>/g , '' );
    str    = str.replace( /<\/strong>/g , '' );
    str    = str.replace( /<\/div>/g , '' );
    str    = str.replace( /\n+/g , '\n' );
    str    = str.replace( /<br>/g , ' ' );
    str    = str.trim();
    
    while ( true ) {

        aCut   = '<a class="bubWrapLink">';
        aCutID = str.indexOf( aCut ) + aCut.length;
        bCut   = '<span';
        bCutID = str.indexOf( bCut ) - aCutID;
        tmp    = str.substr( aCutID , bCutID );
        str    = str.replace( /<a class="bubWrapLink">(.*?)<\/a>/ , tmp );
        
        if ( !str.includes( '<a class="bubWrapLink">' ) ) break;
    
    }

    return str;

}

// -- =====================================================================================
