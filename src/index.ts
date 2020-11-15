import * as express                     from "express"
import * as user                        from "./tools/user";
import * as genetics                    from "./tools/genetics";
import * as u                           from "./types/user";
let nodeMailer = require( 'nodemailer' );

// -- =====================================================================================

const PORT = process.env.PORT || 5000;
const app = express();
import { Pool }                         from 'pg';

app.get( '/verificationCode', function (req, res) {
    
    if ( !req.query.e || !req.query.c ) return 0;
    
    let transporter = nodeMailer.createTransport( {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'language.power.mail.center@gmail.com',
            pass: 'lpmcLPMC!@#$%12345'
        }
    } );

    let mailOptions = {
        to: req.query.e,
        subject: "Verification Code: ",
        text: req.query.c
    };

    transporter.sendMail( mailOptions, (error, info) => {} );
    res.end();

} );



app.get( '/test', async ( req: express.Request, res: express.Response ) => {
    

    const pool = new Pool( {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
    } );


    const client = await pool.connect();

    let query = `SELECT * FROM users WHERE 
        id = 1`;

    const result = await client.query( query );
    
    if ( result.rows.length ) {

        console.log(result.rows[0].devices[0]);
        
    
    }

    else console.log("No Row!");
    
    
    client.release();
        
} );

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