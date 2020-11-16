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

export function _validator ( email: string, keyString: string ): Promise<u.user> {

    return new Promise ( async (rs, rx) => {

        let uuid: string,
            query: string,
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

export function _hasCredit ( user: u.user ): Promise<void> {

    return new Promise ( (rs, rx) => {

        if ( user.credit > 0 ) return rs();
        else return rx( "insufficient credit!" );
    
    } );

}

// -- =====================================================================================

export function deviceRecognized ( devices, key: u.key ) {
    return devices.some( device => device.uuid === key.uuid )
}

// -- =====================================================================================

// export async function _received_cell ( user: u.user, ribosome: g.Ribosome, id: string ) {

    // try {

    //     const client = await pool.connect();
    
    //     // .. touch
    //     if ( !user.purchased_items ) user.purchased_items = {};
    //     // .. register
    //     user.purchased_items[ ribosome.code ] ? 
    //         user.purchased_items[ ribosome.code ].push( id ) :
    //         user.purchased_items[ ribosome.code ] = [id]

    //     let query = `UPDATE users SET 
    //         purchased_items = '${JSON.stringify(user.purchased_items)}',
    //         credit = ${user.credit -1} 
    //         WHERE id='${user.id}'`;

    //     await client.query( query );
        
    //     client.release();
    
    // }
    
    // // TODO should we do something with this err?!
    // catch (err) {  }

// }

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

export function 
user_needs_these ( user: u.user, DNA: g.gene[] ): Promise<number[]> {

    return new Promise ( (rs, rx) => {

        let list = [];
    
        // .. create list
        for ( let i=0; i < DNA.length; i++ ) list.push(i);
    
        // .. first Meet: return result
        if ( !user.gotFromThisRibosome.length ) return rs ( list );
            
        // .. trim list
        list = list.filter( i => !user.gotFromThisRibosome.includes(i+"") );

        // .. return result
        return list.length ? rs( list ) : rx( "no more lesson" );
    
    } );

}