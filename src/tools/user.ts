import { Pool }                         from 'pg';
import * as g                           from '../types/genetics'
import * as u                           from '../types/user'
import { crypto } from './crypto';

// -- =====================================================================================

const pool = new Pool( {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
} );

// -- =====================================================================================

export function _newUser ( email: string, key: u.key ): Promise<u.user> {

    return new Promise ( async (rs, rx) => {

        const client = await pool.connect();

        try {

            let query = `
                INSERT INTO users 
                    ( email, devices, purchased_items )
                VALUES 
                    ( '${ email }', '${ JSON.stringify( [ key ] ) }', '{}' )
                RETURNING *;
            `;

            const register = await client.query( query );

            if ( register.rowCount ) rs ( register );
            else rx( "Unable to Register!" );
        
        } catch (err) { rx( "Error " + err ) }

        client.release();

    } );

}

// -- =====================================================================================

export function _userExists ( email: string ): Promise<u.user|false> {

    return new Promise ( async (rs, rx) => {

        const client = await pool.connect();

        try {

            let query = `
                SELECT * FROM users 
                WHERE 
                    email = '${email}'
            `;

            const findUser = await client.query( query );

            if ( findUser.rowCount ) rs ( findUser.rows[0] as u.user );
            else rs( false );
        
        } catch ( err ) { rx( "Error " + err ) }

        client.release();

    } );

}

// -- =====================================================================================

export function _addDevice ( user: u.user, key: u.key ): Promise<u.user> {

    return new Promise ( async (rs, rx) => {

        const client = await pool.connect();

        try {

            user.devices.push( { 
                ...key, 
                date: Math.floor( Date.now() / 1000 ) 
            } );

            let query = `
                UPDATE users SET 
                    devices = '${ JSON.stringify( user.devices ) }'
                WHERE 
                    id = '${ user.id }'
                RETURNING *;
            `;

            const result = await client.query( query );

            if ( result.rowCount ) rs ( user );
            else rx( "Unable to update user" );
        
        } 
        
        catch ( err ) { rx( "Error " + err ) }

        client.release();

    } );

}

// -- =====================================================================================

export function _validator ( email: string, keyString: string ): Promise<u.user> {

    return new Promise ( async (rs, rx) => {

        let query: string,
            key: u.key;

        try { key = JSON.parse( crypto( keyString, false, true ) ) } 
        catch ( err ) { return rx( err ); }
        
        try {

            const client = await pool.connect();
            
            query = `SELECT * FROM users WHERE email = '${ email }'`;

            const result = await client.query( query );
            
            // .. checking Device
            if ( result.rowCount )
                deviceRecognized( result.rows[0].devices, key ) ? 
                    rs( result.rows[0] ) : rx( "unrecognizable device!" );

            else rx( "unrecognizable user!" );
            
            client.release();
        
        } catch (err) { rx( "Error " + err ) }

    } );

}

// -- =====================================================================================

export function _hasCharge ( user: u.user ): Promise<void> {

    return new Promise ( (rs, rx) => {

        if ( user.charge > 0 ) return rs();
        else return rx( "insufficient charge!" );
    
    } );

}

// -- =====================================================================================

export function deviceRecognized ( devices, key: u.key ) {
    return devices.some( device => device.uuid === key.uuid )
}

// -- =====================================================================================

export function _received_cell ( user: u.user, ribosomeCode: string, id: string ) {

    return new Promise ( async (rs, rx) => {

        try {

            const client = await pool.connect();
            let alreadyPurchased = false;

            try {
                if ( user.purchased_items[ ribosomeCode ].includes( id ) ) 
                    alreadyPurchased = true;
            } catch {}

            // .. register
            if ( !alreadyPurchased ) {

                user.purchased_items[ ribosomeCode ] ? 
                    user.purchased_items[ ribosomeCode ].push( id ) :
                    user.purchased_items[ ribosomeCode ] = [ id ];

                user.charge--;
            
            }

            let query = `
                UPDATE users SET 
                    purchased_items = '${ JSON.stringify( user.purchased_items ) }',
                    charge = ${ user.charge } 
                WHERE 
                    id='${ user.id }'
            `;

            let result = await client.query( query );
            
            if ( result.rowCount ) rs();
            else rx( "Unable to Update user!" );

            client.release();

        } catch ( err ) { rx ( "err: " + err )  }

    } );

}

// -- =====================================================================================

export function a_good_gene_4_user ( 
    
    user: u.user, 
    DNA: g.gene[], 
    by: "start"|"random"|"end"

): Promise<g.gene> {

    return new Promise ( (rs, rx) => {
        
        user_needs_these( user, DNA ).then( ids => {
            // .. get first|random|last suitable gene
            let id: number;
            switch ( by ) {
                case "start" : id = 0;                                        break;
                case "random": id = Math.floor( Math.random() * ids.length ); break;
                case "end"   : id = ids.length -1;                            break;
            }
            let gene = { id: ids[ id ].toString(), ...DNA[ ids[ id ] ] };
            rs( gene );
        } )
        .catch( err => rx(err) )
    
    } );

}

// -- =====================================================================================

export function user_needs_these ( user: u.user, DNA: g.gene[] ): Promise<number[]> {

    return new Promise ( (rs, rx) => {

        let list = [];
    
        // ! do we need this??
        // .. create list
        for ( let i=0; i < DNA.length; i++ ) list.push( i.toString() );
    
        // .. first Meet: return result
        if ( !user.gotFromThisRibosome.length ) return rs ( list );
            
        // .. trim list
        list = list.filter( i => !user.gotFromThisRibosome.includes(i) );

        // .. return result
        return list.length ? rs( list ) : rx( "no more lesson" );
    
    } );

}

// -- =====================================================================================

export function _battery_status ( email: string ): Promise<Number> {

    return new Promise ( async (rs, rx) => {

        let query: string;

        try {

            const client = await pool.connect();
            
            query = `SELECT charge FROM users WHERE email = '${ email }'`;

            const result = await client.query( query );
            
            if ( result.rowCount ) rs( (result.rows[0] as u.user ).charge );

            else rx( "unrecognizable user!" );
            
            client.release();
        
        } catch (err) { rx( "Error " + err ) }

    } );

}

// -- =====================================================================================

export function _charger ( user: u.user ): Promise<Number> {
    
    return new Promise ( async (rs, rx) => {

        try {

            user.charge = user.charge +1;
            if ( user.charge > 5 ) user.charge = 5;

            const client = await pool.connect();
            
            let query = `
                UPDATE users SET 
                    charge = ${ user.charge } 
                WHERE 
                    id='${ user.id }'
            `;

            const result = await client.query( query );
            
            if ( result.rowCount ) rs( (result.rows[0] as u.user ).charge );
            else rx( "Unable to Update user!" );
            
            client.release();
        
        } catch (err) { rx( "Error " + err ) }

    } );

}