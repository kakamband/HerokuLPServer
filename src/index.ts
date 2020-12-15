import * as express                     from "express"
import * as usr                         from "./tools/user";
import * as genetics                    from "./tools/genetics";
import * as u                           from "./types/user";
import { crypto }                       from "./tools/crypto";

// -- ======================================================================== INIT =======

let nodeMailer = require( 'nodemailer' );
const PORT = process.env.PORT || 5000;
const app = express();
var bodyParser = require('body-parser');

// -- ======================================================================= SETUP =======

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );


// -- ===================================================== CHECKING  Email Address =======

app.get( '/beautyBGList', ( req: express.Request, res: express.Response ) => {
    let list = {
        sign    : { height: "35%", translateY: 0    } ,
        skull   : { height: "40%", translateY: -30  } ,
        mountain: { height: "45%", translateY: 0    } ,
        bird    : { height: "30%", translateY: -100 } ,
    }
    res.json( { status: 200, answer: list } )
} );

// -- ===================================================== CHECKING  Email Address =======

app.get( '/giveMeBG', ( req: express.Request, res: express.Response ) => {
    let fileName = req.query.f + ".jpg";
    let filePath = "/src/beautyBGs/" + fileName;
    res.download( filePath, fileName ); 
} );

// -- ===================================================== CHECKING  Email Address =======

app.get( '/isEmailExists', ( req: express.Request, res: express.Response ) => {
    usr._userExists( req.query.e as string ).
    then( user => res.json( { status: 200, answer: !user } ) ).
    catch( err => res.json( { status: 500, "reason": err } ) );
} );

// -- ================================================= verification  Email Address =======

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
    
    let email = req.query.e as string,
        keyString = crypto( req.query.k as string, false, true ),
        key: u.key;

    try { key = JSON.parse( keyString ) } catch {}

    if ( !key ) return res.json( { status: 500, reason: "key is broken!" } );

    usr._userExists( email ).
    then( user => {

        // .. new User
        if ( !user ) {
            usr._newUser( email, key ).
            then( () => res.json( { status: 200, answer: "ok" } ) ).
            catch( err => res.json( { status: 500, "reason": err } ) );
        }

        // .. old User
        else {
            //.. check user
            let hasTrace = usr.deviceRecognized( user.devices, key );
            // .. same device
            if ( hasTrace ) return res.json( { status: 200, reason: "old device" } );
            // .. different device
            else {

                // .. new slot will be occupied!
                if ( user.devices.length < 3 ) {

                    usr._addDevice( user, key ).
                    then( updatedUser => {
                        res.json( { 
                            status: 200, 
                            answer: "new device registered", 
                            data: updatedUser.devices 
                        } );
                    } ).
                    catch( err => res.json( { status: 500, "reason": err } ) );
                }

                // .. 3 Device has been Registered already!
                else return res.json( { 
                    status: 500, 
                    reason: "device exceeded!", 
                    data: user.devices 
                } );



            }
        }

    } ).
    catch( err => res.json( { status: 500, "reason": err } ) );


} );

// -- =================================== Providing Ribosomes filtered by Institute =======

app.post( '/purchasedItems', ( req: express.Request, res: express.Response ) => {
    
    let queries: {
        e: string,
        k: string,
    };

    queries = req.body;

    // .. validating User
    usr._validator( queries.e, queries.k ).
    then( user => {
        let cryptoItems = crypto( JSON.stringify( user.purchased_items ), queries.k );
        res.json( { status: 200, "answer": cryptoItems } )
    } ).
    catch( err => res.json( { status: 500, "reason": err } ) );

} );

// -- =================================== Providing Ribosomes filtered by Institute =======

app.get( '/ribosome', ( req: express.Request, res: express.Response ) => {
    genetics._ribosomes( req.query.i as string ).
    then( list => {
        // .. I hate coffeeBazar!
        if 
        ( 
            req.query.e === "tmiladthrenody@gmail.com"  ||
            req.query.e === "mojpaydar2@gmail.com"      ||
            req.query.e === "venusrzz3@gmail.com"       ||
            req.query.e === "taherikamran@yahoo.com"
        ) 
            res.json( list.filter( x => ( x.code === "EATGOUT" ) ) )
        else res.json( list.filter( x => !x.private ) );
    } );
} );

// -- ========================================================== Providing New Cell =======

app.post( '/x_cell', ( req: express.Request, res: express.Response ) => {
    
    let queries: {
        e: string,
        k: string,
        r: string,
        l: string[],
    };

    queries = req.body;

    // .. validating User
    usr._validator( queries.e, queries.k ).then( user => { 

        // .. checking charge
        usr._hasCharge( user ).then( () => {
            
            user.gotFromThisRibosome = queries.l;

            // .. produce a new CELL
            genetics._crypto_cell ( queries.r, user, queries.k ).
            then( data => {

                // .. first register this lesson for user
                usr._received_cell( user, queries.r, data.id ).
                // .. then hand over the lesson to the user
                then( () => res.json( { status: 200, "answer": data.cryptoCell } ) ).
                catch( err => res.json( { status: 500, "reason": err } ) );
            
            } )
            .catch( err => res.json( { status: 500, "reason": err } ) );

        } ).
        catch( err => res.json( { status: 402, "reason": err } ) );

    } ).
    catch( err => res.json( { status: 401, "reason": err } ) );

} );

// -- =========================================================== Listening on Port =======

app.post( '/battery', ( req: express.Request, res: express.Response ) => {
    
    let queries: {
        e: string,
        k: string,
        p: number,
    };

    queries = req.body;

    // .. charger
    if ( queries.p ) {
        // .. validating User
        usr._validator( queries.e, queries.k ).then( user => {
            usr._charger( user, queries.p ).
            then( charge => res.json( { status: 200, "answer": charge } ) ).
            catch( err => res.json( { status: 500, "reason": err } ) );
        } );
    }

    // .. just report
    else {
        usr._battery_status( queries.e ).
        then( charge => res.json( { status: 200, "answer": charge } ) ).
        catch( err => res.json( { status: 500, "reason": err } ) );
    }

} );

// -- =========================================================== Listening on Port =======

app.listen( PORT, () => console.info( `\n ... running on ${ PORT } ...\n` ) ); 

// -- =====================================================================================