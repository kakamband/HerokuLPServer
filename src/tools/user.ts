import { Pool }                         from 'pg';
import * as g                           from '../types/genetics'
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
            
            if ( result.rows.length ) {

                let devices = result.rows[0].devices.split( "," );
                // .. valid
                if ( !devices.length || devices.includes( uuid ) ) rs( result.rows[0] );
                // TODO define slot
                else {
                    devices.push(uuid);
                    let query2 = `UPDATE users SET 
                        devices = '${devices.join(",")}'
                        WHERE id=${result.rows[0].id}`;
                    // TODO it does not update result!
                    await client.query( query2 );

                    rs( result.rows[0] );
                }
                // rx( "unrecognizable device!" );
            
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

// export async function _received_cell ( user: u.user, ribosomeCode: string, id: string ) {

    // try {

    //     const client = await pool.connect();
    
    //     // .. touch
    //     if ( !user.purchased_items ) user.purchased_items = {};
    //     // .. register
    //     user.purchased_items[ ribosomeCode ] ? 
    //         user.purchased_items[ ribosomeCode ].push( id ) :
    //         user.purchased_items[ ribosomeCode ] = [id]

    //     let query = `UPDATE users SET 
    //         purchased_items = '${JSON.stringify(user.purchased_items)}',
    //         credit = ${user.credit -1} 
    //         WHERE id='${user.id}'`;

    //     await client.query( query );
        
    //     client.release();
    
    // }
    
    // // TODO should we do something with this err?!
    // catch (err) { console.log(err) }

// }

// -- =====================================================================================

export function a_good_gene_4_user ( 
    
    ribosomeCode: string, 
    user: u.user, 
    DNA: g.gene[], 
    by: "start"|"random"|"end"

): Promise<g.gene> {

    return new Promise ( (rs, rx) => {
        
        user_needs_these( ribosomeCode, user, DNA )
        .then( ids => {
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
user_needs_these ( ribosomeCode: string, user: u.user, DNA: g.gene[] ): Promise<number[]> {

    return new Promise ( (rs, rx) => {

        let list = [];
    
        // .. create list
        for ( let i=0; i < DNA.length; i++ ) list.push(i);
    
        // .. first Meet: return result
        if ( !user.gotLessons.length ) return rs ( list );
            
        // .. trim list
        list = list.filter( i => !user.gotLessons.includes(i) );

        // .. return result
        return list.length ? rs( list ) : rx( "no more lesson" );
    
    } );

}