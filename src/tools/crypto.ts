export function crypto ( str: string, key: string, decode=false ) {

    function _c ( str: string ): string {
        return Buffer.from( str, "utf8" ).toString( 'base64' ).replace( /\=/g, "" );
    }

    function _d ( str: string ): string {
        return Buffer.from( str, "base64" ).toString( 'utf8' );
    }

    function _m ( str: string, x: string, y: string ) {
        return str = str.
            replace( new RegExp( x, "g" ), '=' ).
            replace( new RegExp( y, "g" ), x ).
            replace( /\=/g, y );
    }

    function _x ( str: string ): string {
        str = _m( str, "z", "Z" );
        str = _m( str, "6", "9" );
        str = _m( str, "n", "u" );
        str = _m( str, "b", "d" ); 
        str = _m( str, "p", "q" );
        return str;
    }

    return !decode ?
        _x( _c( _c( key ) + _c( str ) ) ) :
        _d( _d( _x( str ) ).replace( _c( key ), "" ) )
        ;

}