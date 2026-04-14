import fs from 'fs'
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const hadiths=JSON.parse(fs.readFileSync('hadith.json','utf8'));

try{
    const db = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB
    });
    let count=0;
    for(let hadith of hadiths ){
        count=count+1;
        console.log(count)
        await db.execute('insert into hadiths (bookName, title, arabicText, banglaText, englishTitle, englishText) values (?, ?, ?, ?, ?, ?)',
        [
            hadith.bookName,
            hadith.title,
            JSON.stringify(hadith.arabicText || []),
            JSON.stringify(hadith.banglaText || []),
            hadith.englishTitle || "",
            hadith.englishText || ""
        ]);        
    }

    await db.end();      
    console.log("Insertion done");
}catch(error){
    console.log(error.message)
}


// CREATE TABLE hadiths (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     bookName VARCHAR(100),
//     title TEXT,
//     arabicText JSON,
//     banglaText JSON,
//     englishTitle TEXT,
//     englishText TEXT,
//     INDEX idx_bookname (bookName)
// );