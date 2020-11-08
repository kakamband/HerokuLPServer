import * as express                     from "express"
import { ribosomesCollection }          from "./ribosomesCollection";
import * as user                        from "./tools/user";
import * as genetics                    from "./tools/genetics";
import { Pool }                         from 'pg';

// -- =====================================================================================

const PORT = process.env.PORT || 5000;
const app = express()
const pool = new Pool( {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
} );


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
            
            // .. produce a new CELL
            genetics._crypto_cell ( req.query.r as string, req.query.u as string )
            .then( crypto_cell => res.json( crypto_cell ) )
            .catch( err => res.json( { "answer": null, "reason": err } ) );

        } )
        .catch( err => res.json( { "answer": null, "reason": err } ) );

    } ) 
    .catch( err => res.json( { "answer": null, "reason": err } ) );

} );

// -- =====================================================================================

app.get( '/PGdb', async (req, res) => {
    
    try {
        const client = await pool.connect();
        let query = 'SELECT * FROM users';
        const result = await client.query( query );
        const results = { 'results': result ? result.rows : null };
        res.json( results );
        client.release();
    } catch (err) {
        console.error(err);
        res.send( "Error " + err );
    }

} )


// -- =====================================================================================

// .. Listening on Port 
app.listen( PORT, () => console.info( `\n ... running on ${ PORT } ...\n` ) ); 

// -- =====================================================================================
