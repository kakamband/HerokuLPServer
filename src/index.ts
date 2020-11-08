import * as express                     from "express"
import { ribosomesCollection }          from "./db/ribosome/ribosomes";
import * as user                        from "./tools/user";
import * as genetics                    from "./tools/genetics";

// -- =====================================================================================

const PORT = process.env.PORT || 5000;
const app = express()

// -- =====================================================================================

// .. Providing Ribosomes filtered by Institute
app.get( '/ribosome', ( req: express.Request, res: express.Response ) => {
    res.json( ribosomesCollection.filter( r => r.institute === req.query.i ) )   
} );

// -- =====================================================================================

// .. Providing New Chromosome
app.get( '/chromosome', ( req: express.Request, res: express.Response ) => {
    
    // .. validating User
    user._validator( req.query.u as string ).then( userId => { 

        // .. checking credits
        user._hasCredit( userId ).then( credit => {
            
            // .. get a gene
            genetics.gene ( req.query.r as string, req.query.u as string )
            .then( gene => res.json( gene ) )
            .catch( err => res.json( { "answer": null, "reason": err } ) );

        } )
        .catch( err => res.json( { "answer": null, "reason": err } ) );

    } ) 
    .catch( err => res.json( { "answer": null, "reason": err } ) );

} );

// -- =====================================================================================

// .. Listening on Port 
app.listen( PORT, () => console.info( `\n ... running on ${ PORT } ...\n` ) ); 

// -- =====================================================================================
