import * as express                     from "express"
import * as user                        from "./tools/user";
import * as genetics                    from "./tools/genetics";
import * as u                           from "./types/user";
import { Pool }                         from 'pg';
import { crypto }                       from "./tools/crypto";

// -- ======================================================================= SETUP =======

let nodeMailer = require( 'nodemailer' );
const PORT = process.env.PORT || 5000;
const app = express();

// -- ================================================= verification  Email Address =======

app.get( '/verificationCode', function (req, res) {
    
    if ( !req.query.e || !req.query.c ) return 0;
    
    let transporter = nodeMailer.createTransport( {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'language.power.mail.center@gmail.com',
            pass: ''
        }
    } );

    let mailOptions = {
        to: req.query.e,
        subject: "Verification Code",
        text: req.query.c
    };

    transporter.sendMail( mailOptions ).then( () => res.json( { 
        status: 200,
        answer: "sent"
    } ) );

} );

// -- ================================================== register New Verified User =======

app.get( '/register', async ( req: express.Request, res: express.Response ) => {

    const pool = new Pool( {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
    } );

    const client = await pool.connect();
    
    let email = req.query.e,
        keyString = crypto( req.query.k as string, false, true ),
        key: u.key,
        query: string;

    try { key = JSON.parse( keyString ) } catch {}

    if ( !key ) return res.json( { status: 500, reason: "key is broken!" } );

    key.date = Math.floor( Date.now() / 1000 );

    query = `SELECT * FROM users WHERE email = '${email}'`;

    const result = await client.query( query );
    
    // .. old user
    if ( result.rowCount ) {
        
        let hasTrace = user.deviceRecognized( result.rows[0].devices, key );

        if ( hasTrace ) return res.json( { status: 200, reason: "old device" } );
        
        else {

            // .. new slot will be occupied!
            if ( result.rows[0].devices.length < 3 ) {

                result.rows[0].devices.push( key );
                query = `UPDATE users SET 
                    devices = '${ JSON.stringify( result.rows[0].devices ) }'
                    WHERE id = '${ result.rows[0].id }'
                    RETURNING *;`;

                const register = await client.query( query );

                if ( register.rowCount ) res.json( { 
                    status: 200, 
                    answer: "new device registered", 
                    data: register.rows[0].devices 
                } );

            }

            // .. 3 Device has been Registered already!
            else return res.json( { 
                status: 500, 
                reason: "device exceeded!", 
                data: result.rows[0].devices 
            } );

        };
    
    }
    // .. new user
    else {

        query = `INSERT INTO users ( email, devices )
            VALUES ( '${ email }', '${ JSON.stringify( [ key ] ) }' )
            RETURNING *;`;

        const register = await client.query( query );
        
        if ( register.rowCount ) res.json( { 
            status: 200, 
            answer: "new user registered"
        } );
        
    }    
    
    client.release();
        
} );

// -- =================================== Providing Ribosomes filtered by Institute =======

app.get( '/ribosome', ( req: express.Request, res: express.Response ) => {
    genetics._ribosomes( req.query.i as string ).then( list => res.json( list ) );
} );

// -- ========================================================== Providing New Cell =======

app.get( '/crypto_cell', ( req: express.Request, res: express.Response ) => {
    
    // .. validating User
    user._validator( req.query.e as string, req.query.k as string ).then( u => { 

        // .. checking credits
        user._hasCredit( u ).then( () => {
            
            u.gotFromThisRibosome = req.query.l as string[];

            // .. produce a new CELL
            genetics._crypto_cell ( 
                req.query.r as string, 
                u as u.user, 
                req.query.k as string 
            )
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

// -- =========================================================== Listening on Port =======

app.listen( PORT, () => console.info( `\n ... running on ${ PORT } ...\n` ) ); 

// -- =====================================================================================