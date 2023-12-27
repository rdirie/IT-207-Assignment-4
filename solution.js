/*
Title: Assignment 4
Description: Sailing Adventure SQL
Name: Rayyan Dirie
Date: 12/03/2023
Section: 001
*/

//Import the mysql2 module
const mysql = require('mysql2');
let sailors = require('./lib/sailors.js')
let boats = require('./lib/boats.js')
let reserves = require('./lib/reserves.js')
const http = require("http");
const {URL} = require("url");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RayCS_Mason23',
    multipleStatements: true,
});

let sql = "CREATE DATABASE IF NOT EXISTS SailingAdventure";
//Callback Query
db.query(sql, (err)=>{
    if(err) throw err;
    console.log('Database Created - Sailing Adventure');
})

//Check the status of the connection
db.connect((err)=>{
    if (err)
        return console.log("Error: " + err.message);
    console.log("Connected to the MySQL Server")
})

//Create Tables
sql = "CREATE TABLE IF NOT EXISTS SailingAdventure.sailors("
        + "S_Id INTEGER AUTO_INCREMENT PRIMARY KEY ,"
        + "S_name VARCHAR(255),"
        + "B_date DATE,"
        + "Rate INTEGER)"

db.query(sql, (err)=>{
    if(err) throw err;
    console.log('Table Created - Sailors');
})

sql = "CREATE TABLE IF NOT EXISTS SailingAdventure.boats("
    + "B_Id INTEGER AUTO_INCREMENT PRIMARY KEY,"
    + "B_name VARCHAR(255),"
    + "Type VARCHAR(255))"

db.query(sql, (err)=>{
    if(err) throw err;
    console.log('Table Created - Boats');
})

sql = "CREATE TABLE IF NOT EXISTS SailingAdventure.reserves("
        + "S_Id INTEGER,"
        + "B_Id INTEGER,"
        + "Day DATE,"
        + "PRIMARY KEY (S_Id, B_Id, Day),"
        + "CONSTRAINT FOREIGN KEY (S_Id) REFERENCES sailors(S_Id)"
        + "ON UPDATE CASCADE ON DELETE CASCADE,"
        + "CONSTRAINT FOREIGN KEY (B_Id) REFERENCES boats(B_Id)"
        + "ON UPDATE CASCADE ON DELETE CASCADE)";

db.query(sql, (err)=>{
    if(err) throw err;
    console.log('Table Created - Reserves');
})

// Server Handler
const server = http.createServer((req,res)=>{
    const baseURL = "http://" + req.headers.host + '/';
    const parsedUrl = new URL(req.url, baseURL); 
    //get the untrimed path from the url
    const path = parsedUrl.pathname; 
    //Get the query string as an object
    const searchParam = parsedUrl.searchParams
    const entries = searchParam.entries();
    const qs = Object.fromEntries(entries);
    //Get the HTTP method
    const method = req.method.toUpperCase();

    //Route based on the request method
    switch (method){
        //POST Switch
        case 'POST':
            switch(path){
                case '/sailors':
                    sailors.add(db, qs, (statusCode, results)=>{
                    res.setHeader('content-type','text/plain; charset="utf-8"');
                    res.writeHead(statusCode);
                    res.end(results);
                });
                break; 
                case '/boats':
                    boats.add(db, qs, (statusCode)=>{
                        res.setHeader('content-type','text/plain; charset="utf-8"');
                        res.writeHead(statusCode);
                        res.end("Added Succesfully");
                    });
                break;
                case '/reserves':
                    reserves.add(db,qs,(statusCode, results)=>{
                    res.setHeader('content-type','text/plain; charset="utf-8"');
                    res.writeHead(statusCode);
                    res.end(results);
                    });
                break;
            }
            break;

        //GET Switch
        case 'GET':
            switch(path){
                case '/sailors':
                    sailors.display(db, (statusCode, output)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(statusCode);
                        res.end(output);
                    })
                    break;
                case '/sailors/Before': 
                case '/sailors/Before/': 
                    sailors.before(db, qs, (statusCode, results)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(statusCode);
                        res.end(results);
                    });
                    break;
                case '/sailors/After': 
                case '/sailors/After/':
                    sailors.after(db, qs, (statusCode, results)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(statusCode);
                        res.end(results);
                    });
                    break;
                case '/boats':
                    boats.display(db, (output)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(200);
                        res.end(output);
                    })
                    break;
                case '/boats/Type':
                case '/boats/Type/':
                    boats.type(db,qs,(statusCode, results)=>{
                        res.setHeader('content-type','text/plain; charset="utf-8"');
                        res.writeHead(statusCode);
                        res.end(results);
                        });
                    break;
                case '/boats/Count':
                case '/boats/Count/':
                    boats.count(db,qs,(statusCode, results)=>{
                        res.setHeader('content-type','text/plain; charset="utf-8"');
                        res.writeHead(statusCode);
                        res.end(results);
                        });
                    break;
                case '/reserves':
                    reserves.display(db, (statusCode, output)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(statusCode);
                        res.end(output);
                    })
                    break;
                case '/reserves/Before':
                case '/reserves/Before/':  
                    reserves.before(db, qs, (statusCode, output)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(statusCode);
                        res.end(output);
                    })
                    break;
                case '/reserves/After': 
                case '/reserves/After/':
                    reserves.after(db, qs, (statusCode, output)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(statusCode);
                        res.end(output);
                    })
                    break;
            }
            break;
        
        //DELETE Switch
        case 'DELETE':
            switch(path){
                case '/sailors':
                    sailors.delete(db,qs, (results)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(200);
                        res.end(results);
                    })
                    break;
                case '/boats':
                    boats.delete(db,qs, (results)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(200);
                        res.end(results);
                        });
                    break;
                case '/reserves':
                    reserves.delete(db,qs, (results)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(200);
                        res.end(results);
                    })
                break;
            }
            break;
        
        //PUT Switch
        case 'PUT':
            switch(path){
                case '/sailors':
                    sailors.update(db,qs, (results)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(200);
                        res.end(results);
                    })
                    break;
                case '/boats':
                    boats.update(db,qs, (results)=>{
                        res.setHeader('Content-Type','text/plain,charset = "utf-8"');
                        res.writeHead(200);
                        res.end(results);
                        });
                    break;
            }
            break;
        }
    });

    server.listen(3030, function(){
        console.log('Server running on port 3030 ....');
    });