export function crypto ( str: string, key: string, decode=false ) {
    
    function s_one( str: string, decode = false ): string {
        return Buffer
            .from( str, decode ? "base64" : "utf8" )
            .toString( decode ? 'utf8' : 'base64' )
            .replace( /\=/g, "" );
    }

    function s_two( str: string, decode=false ): string {
        return Buffer
            .from( str, decode ? "utf8" : 'ucs2' )
            .toString( decode ? 'ucs2' : "utf8" );
    }

    function s_three ( str: string, decode=false ): string {
        str = str.replace( /z/g, '=' ).replace( /Z/g, 'z' ).replace( /\=/g, 'Z' );
        str = str.replace( /6/g, '=' ).replace( /9/g, '6' ).replace( /\=/g, '9' );
        str = str.replace( /n/g, '=' ).replace( /u/g, 'n' ).replace( /\=/g, 'n' );
        str = str.replace( /b/g, '=' ).replace( /d/g, 'b' ).replace( /\=/g, 'd' );
        str = str.replace( /p/g, '=' ).replace( /q/g, 'p' ).replace( /\=/g, 'q' );
        return str;
    }

    return decode ?
        s_one( s_two( s_three( str, true ), true ).replace( s_one( key ), "" ), true ) :
        s_three( s_two( s_one( key ) + s_one( str ) ) );

}
