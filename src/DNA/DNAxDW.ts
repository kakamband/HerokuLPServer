
// -- =====================================================================================

export function avatar ( str: string ) {
    
    let aCut: string,
        bCut: string,
        aCutID: number,
        bCutID: number;

        // .. First Attempt
        aCut = '<meta property="og:image"\ncontent="';
        bCut   = '"/>';
        if ( str.includes( aCut ) ) {
            aCutID = str.indexOf( aCut ) + aCut.length;
            str    = str.substr( aCutID );
            bCutID = str.indexOf( bCut );
            str    = str.substring( 0 , bCutID );
            str    = str.replace( '_304.' , '_302.' );
            return str;
        } 
    
        // .. Second Attempt
        aCut = 'input type="hidden" name="preview_image" value="';
        bCut   = '">';
        if ( str.includes( aCut ) ) { 
            aCutID = str.indexOf( aCut ) + aCut.length;
            str    = str.substr( aCutID );
            bCutID = str.indexOf( bCut );
            str    = str.substring( 0 , bCutID );
            str    = str.replace( '_401.' , '_302.' );
            return str;
        }
        
        // .. no Result
        return null;

}

// -- =====================================================================================

export function audio_page ( str: string ) {

    let aCut: string,
        aCutID: number,
        bCutID: number;

    aCut    = '<div class="linkList overlayIcon">';
    aCutID  = str.lastIndexOf( aCut ) + aCut.length;
    str     = str.substr( aCutID );
    aCut    = 'href="';
    aCutID  = str.indexOf( aCut ) + aCut.length;
    str     = str.substr( aCutID );
    bCutID  = str.indexOf( '"' );
    str     = str.substr( 0 , bCutID );
    str     = 'https://www.dw.com' + str;

    return str;

}

// -- =====================================================================================

export function audio ( str: string ) {

    let aCut: string,
        bCut: string,
        aCutID: number,
        bCutID: number;

    bCut    = '.mp3';
    bCutID  = str.indexOf( bCut ) + bCut.length;
    str     = str.substr( 0 , bCutID );
    aCut    = 'https://';
    aCutID  = str.lastIndexOf( aCut );
    str     = str.substr( aCutID );

    return str;

}

// -- =====================================================================================
