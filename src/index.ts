import * as express                     from "express"
import * as user                        from "./tools/user";
import * as genetics                    from "./tools/genetics";
import * as u                           from "./types/user";

// -- =====================================================================================

const PORT = process.env.PORT || 5000;
const app = express();

// -- =====================================================================================

// .. Providing Ribosomes filtered by Institute
app.get( '/ribosome', ( req: express.Request, res: express.Response ) => {
    genetics._ribosomes( req.query.i as string ).then( list => res.json( list ) );
} );

// -- =====================================================================================

// .. Providing New Chromosome
app.get( '/crypto_cell', ( req: express.Request, res: express.Response ) => {
    
    // .. validating User
    user._validator( 
        req.query.u as string, 
        req.query.p as string, 
        req.query.k as string 
    ).then( u => { 

        // .. checking credits
        user._hasCredit( u ).then( () => {
            
            u.gotFromThisRibosome = req.query.l as string[];

            // .. produce a new CELL
            genetics._crypto_cell ( req.query.r as string, u as u.user )
            .then( crypto_cell => {
                res.json( { status: 200, "answer": crypto_cell } );
                // TODO maybe we should confirm it somewhere else
                // user._received_cell( u, req.query.r as string, crypto_cell.id );
            } )
            .catch( err => res.json( { status: 500, "reason": err } ) );

        } )
        .catch( err => res.json( { status: 402, "reason": err } ) );

    } ) 
    .catch( err => res.json( { status: 401, "reason": err } ) );

} );

// -- =====================================================================================

// .. Listening on Port 
app.listen( PORT, () => console.info( `\n ... running on ${ PORT } ...\n` ) ); 

// -- =====================================================================================

function unicodeToChar( text ) {
    return text.replace( /\\u[\dA-F]{4}/gi, 
        function ( match ) {
            return String.fromCharCode( parseInt( match.replace( /\\u/g, '' ), 16 ) );
        } );
}