import { get }                          from 'https';

// -- =====================================================================================

export function html ( link: string ): Promise<string> {

    return new Promise ( (rs, rx) => { 
        
        get( link, res => {
    
            let html = "";

            // TODO Get STATUS CODE
            res.setEncoding('utf8');
            res.on( 'data', chunk => html += chunk )
            res.on( "end", () => rs( html ) );
        
        } );

    } )

}

// -- =====================================================================================