import { Pool }                         from 'pg';
import * as u                           from '../types/user'

// -- =====================================================================================

const pool = new Pool( {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
} );

// -- =====================================================================================

export function 
_validator ( username: string, password: string, uuid: string ): Promise<u.user> {

    return new Promise ( async (rs, rx) => {

        try {

            const client = await pool.connect();
            
            let query = `SELECT * FROM users WHERE 
                username = '${username}' AND 
                password = '${password}'`;

            const result = await client.query( query );
            
            if ( result ) {

                let devices = result.rows[0].devices.split( "," );
                // .. valid
                if ( !devices.length || devices.includes( uuid ) ) rs( result.rows[0] );
                // TODO define slot
                else rx( "unrecognizable device!" );
            
            }

            else rx( "unrecognizable user!" );
            
            client.release();
        
        } catch (err) { rx( "Error " + err ) }

    } );

}

// -- =====================================================================================

export function _hasCredit ( user: u.user ): Promise<void> {

    return new Promise ( (rs, rx) => {

        if ( user.credit > 0 ) return rs();
        else return rx( "insufficient credit!" );
    
    } );

}

// -- =====================================================================================

export async function _received_cell ( user: u.user, ribosomeCode: string, id: number ) {

    try {

        const client = await pool.connect();
    
        // .. touch
        if ( !user.purchased_items ) user.purchased_items = {};
        // .. register
        user.purchased_items[ ribosomeCode ] ? 
            user.purchased_items[ ribosomeCode ].push( id ) :
            user.purchased_items[ ribosomeCode ] = [id]

        let query = `UPDATE users 
            SET purchased_items = '${JSON.stringify(user.purchased_items)}' 
            WHERE id='${user.id}'`;

        await client.query( query );
        
        client.release();
    
    }
    
    // TODO should we do something with this err?!
    catch (err) {}

}