import { audio_page, avatar, audio, _ } from './DWXXXXX'
import * as g                           from '../../types/genetics'

// -- =====================================================================================

export const ABC: g.snapMargin = [] as any; 

// -- =====================================================================================

export function DNA_maker ( id: string, link: string ): Promise<g.gene[]> {

    return new Promise ( (rs, rx) => { 

        _( link ).then( themaPage => {
            _( audio_page( themaPage ) ).then( audioPage => { 
                rs ( [ { 
                    id          : id,
                    title       : title( themaPage ),
                    text        : text( themaPage ),
                    avatarURL   : avatar( themaPage ),
                    mediaURL    : audio( audioPage )
                } ] );
            } );
        } );
    
    } );

}

// -- =====================================================================================

export function DNAxList (): Promise< { id: string, link: string }[] > {
    
    return new Promise ( (rs, rx) => {

        let homeURL = "https://www.dw.com/de/deutsch-lernen/top-thema/s-8031";

        _( homeURL ).then( homePage => {

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
                list.push( {
                    id: item.split("/")[2],
                    link: 'https://www.dw.com' + item
                } );

            }

            return rs( list );
        
        } );
    
    } );

} 

// -- =====================================================================================

function title ( str: string ) {
    
    let aCut: string,
        bCut: string,
        aCutID: number,
        bCutID: number;

    aCut   = "<h1>";
    bCut   = "</h1>";
    aCutID = str.indexOf( aCut ) + aCut.length;
    bCutID = str.indexOf( bCut );
    
    str    = str.substring( aCutID, bCutID );
    
    return str;

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
    str    = str.substring( aCutID , bCutID );
    aCut   = '<p>';
    aCutID = str.indexOf( aCut )  + aCut.length;
    str    = str.substring( aCutID );
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
        bCutID = str.indexOf( bCut );
        tmp    = str.substring( aCutID , bCutID );
        str    = str.replace( /<a class="bubWrapLink">(.*?)<\/a>/ , tmp );
        
        if ( !str.includes( '<a class="bubWrapLink">' ) ) break;
    
    }

    return str;

}

// -- =====================================================================================
