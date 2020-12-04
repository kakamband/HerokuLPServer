
export function youTubeIDFinder ( url: string ) {

    let youTube = [ "youtube.com/" , "youtu.be/" ];
    
    if ( url.includes( youTube[0] ) && url.includes( "?v=" ) ) {

        let aCut: string,
            bCut: string;

        aCut = "?v=";
        url = url.substr( url.indexOf( aCut ) + aCut.length );

        bCut = "&";
        if ( url.includes( bCut ) ) url = url.substring( 0, url.indexOf( bCut ) );
        
        bCut = "/";
        if ( url.includes( bCut ) ) url = url.substring( 0, url.indexOf( bCut ) );

        return url;

    };

    if ( url.includes( youTube[1] ) ) {

        let aCut: string,
            bCut: string,
            bCutId: number;

        aCut = "youtu.be/";
        url = url.substr( url.indexOf( aCut ) + aCut.length );
        
        bCut = "/";
        bCutId = url.indexOf( bCut );
        if ( bCutId > -1 ) url = url.substring( 0, bCutId );

        return url;

    };

    return null;

}

// -- =====================================================================================


// -- =====================================================================================

// export function url2subLink ( url: string ) {

//     return NS.Http.request( {
//         url: url ,
//         method: "GET" ,
//         headers: { "User-Agent": userAgent }
//     } ).then(
//         res => str2subLink( res.content.toString() ), 
//         e => Promise.reject( e + "" )
//     )
//     .catch( e => Promise.reject( e + "" ) );

// }

// // -- =====================================================================================

// function str2subLink( str: string ) {

//     let idx = str.lastIndexOf( "timedtext?v" );
            
//     if ( idx === -1 ) return Promise.reject( "Unable to find Subtitle!" );
            
//     str = str.substr( idx );
//     idx = str.indexOf( '"' );
//     str = str.substring( 0, idx );

//     str = str.replace( /\\\\/g , "\\" );

//     str = str.replace( /\\u[\dA-F]{4}/gi, 
//         function ( match ) {
//             return String.fromCharCode( parseInt( match.replace( /\\u/g, '' ), 16 ) );
//         } 
//     );

//     str = str.replace( /\\/ , "" );

//     str = "https://www.youtube.com/api/" + str + "&lang=en";

//     return Promise.resolve( str );

// }

// -- =====================================================================================

// export function subLinkToSubtile ( url: string ) {

//     return NS.Http.request( {
//         url: url ,
//         method: "GET" ,
//         headers: { "User-Agent": userAgent }
//     } )
//     .then( res => xmlToSubtile( res.content.toString() ) )
//     .catch( e => Promise.reject( e + "" ) );
    
// }

// // -- =====================================================================================

// function xmlToSubtile ( xml: string ): Promise<TS.videoContextRow[]> { 

//     return new Promise( ( rs, rx ) => {

//         xml2js.parseString( xml, ( e, res ) => {

//             let subs = res.transcript.text;
//             let subtitle: TS.videoContextRow[] = [];
    
//             for ( let row of subs ) {
//                 let stop = parseFloat( row.$.start ) + parseFloat( row.$.dur );
//                 let text = row._.replace( /&([^;]+);/g , ( m , c ) => tools.map[c] || '' );
//                 subtitle.push( [ row.$.start, stop.toFixed(2), text ] )
//             }
    
//             rs( subtitle );
    
//         } );

//     } )
  


// }