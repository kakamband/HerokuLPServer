export function _validator ( user: string ): Promise<string> {

    return new Promise ( (rs, rx) => {

        if ( user === "d5176078f1e2f771" ) {
            return rs( user );
        }
        else {
            return rx( "unrecognizable user!" );
        }
    
    } );

}

// -- =====================================================================================

export function _hasCredit ( userId: string ): Promise<number> {

    return new Promise ( (rs, rx) => {

        if ( true ) {
            return rs( 555 );
        }
        else {
            return rx( "insufficient credit!" );
        }
    
    } );

}

// -- =====================================================================================
