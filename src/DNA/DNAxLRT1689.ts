import { html }                         from './DNAx'
import { audio_page, avatar, audio }    from './DNAxDW'
import * as g                           from '../types/genetics'

// -- =====================================================================================

export let DNA: g.gene[] = [];

// -- =====================================================================================

export function DNA_maker (): Promise<g.gene[]> {

    return new Promise ( (rs, rx) => { 
        
        let heute = heuteIst();
        let homeURL = "https://www.dw.com/de/deutsch-lernen/nachrichten/s-8030";

        html( homeURL ).then( homePage => {
            if ( homePage.includes( heute.code ) ) {
                html( newsPage( homePage, heute.code ) ).then( newsPage => {
                    html( audio_page( newsPage ) ).then( audioPage => { 
                        
                        DNA.push( { 
                            id          : heute.code,
                            title       : heute.name,
                            text        : text( newsPage ),
                            avatarURL   : avatar( newsPage ),
                            mediaURL    : audio( audioPage ),
                            hPath       : heute.hPath 
                        } );

                        rs ( DNA );
                    
                    } )
                } );
            }
            else rx ( "No News: " + heute.name );
        } );

    } );

}

// -- =====================================================================================

function heuteIst () {

    let date: Date,
        code: string;

    const monthNames = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];
	
    date = new Date();

    let YYYY = date.getFullYear().toString();
    let YY   = YYYY.substr(2,2);
    let MM   = monthNames[ date.getMonth() ];
    let DD   = date.getDate().toString();

    date  = new Date();
    code = DD + '.' + ( date.getMonth() +1 ) + '.' + YY;

    let heute = {
        code: code,
        name: DD + " " + MM + " " + YYYY, 
        hPath: [ YYYY, MM ],
    };

    console.log(heute);
    
    return heute;
    
}

// -- =====================================================================================

function newsPage ( str: string , heute: string ) {

    let aCut: string,
        bCut: string,
        aCutID: number,
        bCutID: number,
        tmp: string = str;

    // .. get the link
    aCut   = '<div class="col2 basicTeaser">';
    aCutID = str.indexOf( aCut );
    bCut   = heute;
    bCutID = str.lastIndexOf( bCut );
    str    = str.substring( aCutID , bCutID );

    aCut   = '<a href="';
    aCutID = str.indexOf( aCut );
    bCut   = '<h2 class="linkable">';
    bCutID = str.lastIndexOf( bCut );
    str    = str.substring( aCutID , bCutID );

    str    = str.replace( '<a href="' , 'https://www.dw.com' );
    bCut   = '">';
    bCutID = str.indexOf( bCut );
    str    = str.substring( 0 , bCutID );

    // .. second try - in mobile type page
    if ( !str ) {

        str    = tmp;
        
        aCut   = 'class="basicteaser__anchor basicteaser__anchor--S"';
        aCutID = str.indexOf( aCut );
        str    = str.substring( aCutID );

        aCut   = 'href="';
        aCutID = str.indexOf( aCut );
        str    = str.substring( aCutID );
        bCut   = '"';
        bCutID = str.indexOf( bCut );
        str    = str.substring( 0 , bCutID );

        str   = 'https://www.dw.com' + str;

    }

    return str;

}

// -- =====================================================================================

function text ( str: string ) {

    let aCut: string,
        bCut: string,
        aCutID: number,
        bCutID: number;
    
    aCut   = '<div class="longText">';
    aCutID = str.indexOf( aCut ) + aCut.length;
    bCut   = '<!-- detail_toolbox -->';
    bCutID = str.lastIndexOf( bCut );
    str    = str.substring( aCutID , bCutID );
    
    bCut   = '</div>';
    bCutID = str.indexOf( bCut );
    str    = str.substring( 0, bCutID );
    str    = str.replace( /&nbsp;/g , ' ' );
    str    = str.replace( /&amp;/g , '&' );
    str    = str.replace( /<p>/g , '' );
    str    = str.replace( /<\/p>/g , '' );
    str    = str.replace( /<strong>/g , '\n\n' );
    str    = str.replace( /<\/strong>/g , '\n' );
    str    = str.replace( /  \n/g , '\n' );
    str    = str.replace( /\n /g , '\n' );
    str    = str.trim();

    return str;

}

// -- =====================================================================================
