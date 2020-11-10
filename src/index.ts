import * as express                     from "express"
import { ribosomesCollection }          from "./ribosomes/ribosomesCollection";
import * as user                        from "./tools/user";
import * as genetics                    from "./tools/genetics";
import * as u                           from "./types/user";

// -- =====================================================================================

const PORT = process.env.PORT || 5000;
const app = express();

// -- =====================================================================================

// .. Providing Ribosomes filtered by Institute
app.get( '/ribosome', ( req: express.Request, res: express.Response ) => {
    res.json( ribosomesCollection.filter( r => r.institute === req.query.i ) )   
} );

// -- =====================================================================================

// .. Providing New Chromosome
app.get( '/crypto_cell', ( req: express.Request, res: express.Response ) => {
    
    // .. validating User
    user._validator( 
        req.query.u as string, 
        req.query.p as string, 
        req.query.d as string 
    ).then( u => { 

        // .. checking credits
        user._hasCredit( u ).then( () => {
            
            // .. produce a new CELL
            genetics._crypto_cell ( req.query.r as string, u as u.user )
            .then( crypto_cell => { 
                res.json( { status: 200, "answer": crypto_cell.cell } );
                // TODO maybe we should confirm it somewhere else
                user._received_cell( u, req.query.r as string, crypto_cell.id );
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
