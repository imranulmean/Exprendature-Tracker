import { pool } from "./initDb.js";

export const initializeTables= async() =>{
    
    const q=
    `CREATE TABLE cars (
        brand VARCHAR(255),
        model VARCHAR(255),
        year INT
    );
    `
    try {
        const createTable= await pool.query(q);
        console.log(createTable.rows);        
    } catch (error) {
        console.log(`error in table creation: ${error}`);
    }

}

export const deleteTables= async() =>{   

    try {
        const deletion= await pool.query('drop table cars');
        console.log(deletion.rows)        
    } catch (error) {
        console.log(`error in table deletion: ${error}`);
    }

}