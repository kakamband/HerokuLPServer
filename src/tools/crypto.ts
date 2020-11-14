export function crypto ( str: string, key: string, decode=false ) {

    function _c ( str: string ): string {
        return Buffer.from( str, "utf8" ).toString( 'base64' ).replace( /\=/g, "" );
    }

    function _d ( str: string ): string {
        return Buffer.from( str, "base64" ).toString( 'utf8' );
    }

    function _x ( str: string ): string {
        str = str.replace( /z/g, '=' ).replace( /Z/g, 'z' ).replace( /\=/g, 'Z' );
        str = str.replace( /6/g, '=' ).replace( /9/g, '6' ).replace( /\=/g, '9' );
        str = str.replace( /n/g, '=' ).replace( /u/g, 'n' ).replace( /\=/g, 'n' );
        str = str.replace( /b/g, '=' ).replace( /d/g, 'b' ).replace( /\=/g, 'd' );
        str = str.replace( /p/g, '=' ).replace( /q/g, 'p' ).replace( /\=/g, 'q' );
        return str;
    }

    return !decode ?
        _x( _c( _c( key ) + _c( str ) ) ) :
        _d( _d( _x( str ) ).replace( _c( key ), "" ) )
        ;

}