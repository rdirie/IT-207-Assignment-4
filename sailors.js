/*
Title: Assignment 4
Description: Sailing Adventure SQL
Name: Rayyan Dirie
Date: 12/03/2023
Section: 001
*/

//Add Sailors of at least 24 years of age (POST)
exports.add = function(db, obj,cb){
    let sql = `Call SailingAdventure.addSailor(?,?,?,@message); SELECT @message;`;
    db.query(sql,[obj.S_name, obj.B_date, obj.Rate], (err, results)=>{
        if (err) throw err;
        cb(200, results[1][0]['@message']);
    })
}

//Display Function (GET)
exports.display = function(db, cb){
    let sql = `SELECT S_Id, S_name, DATE_FORMAT(B_date, "%a %b %d %Y"), Rate FROM SailingAdventure.sailors`;
    db.query(sql, (err,results)=>{
        if (err) throw err;
        let output = "";
        results.forEach(element => {
            output += JSON.stringify(element);
            output = output.replace("{\"S_Id\":","")
            output = output.replace(",\"S_name\":\""," ")
            output = output.replace("\",\"DATE_FORMAT(B_date, \\\"%a %b %d %Y\\\")\":\"", " ")
            output = output.replace("\",\"Rate\":", " ")
            output = output.replace("}","\n")
        });
        cb(200, output);
    })
}

//Display All Sailors younger than a given Age
exports.before = function(db, obj, cb){
    if(obj.Age == null || obj.Age == ''){
        cb(400, 'Please Enter Valid Age');
    }
    else{
        let sql = `Call SailingAdventure.sailorBefore(?);`;
        db.query(sql, [obj.Age], (err,results)=>{
            if (err) throw err;
            let output = "";
            let newResults = results[0];
            for(let i = 0; i < newResults.length; i++){
                output += JSON.stringify(newResults[i]);
                output = output.replace("{\"S_Id\":","")
                output = output.replace(",\"S_name\":\""," ")
                output = output.replace("\",\"DATE_FORMAT(B_date, \\\"%a %b %d %Y\\\")\":\"", " ")
                output = output.replace("\",\"Rate\":", " ")
                output = output.replace("\"}","\n")
            };
            cb(200, output);
        })
    }
}

//Display All Sailors older than a given Age
exports.after = function(db, obj, cb){
    if(obj.Age == null || obj.Age == ''){
        cb(400, 'Please Enter Valid Age');
    }
    else{
        let sql = `Call SailingAdventure.sailorAfter(?);`;
        db.query(sql, [obj.Age], (err,results)=>{
            if (err) throw err;
            let output = "";
            let newResults = results[0];
            for(let i = 0; i < newResults.length; i++){
                output += JSON.stringify(newResults[i]);
                output = output.replace("{\"S_Id\":","")
                output = output.replace(",\"S_name\":\""," ")
                output = output.replace("\",\"DATE_FORMAT(B_date, \\\"%a %b %d %Y\\\")\":\"", " ")
                output = output.replace("\",\"Rate\":", " ")
                output = output.replace("\"}","\n")
            };
            cb(200, output);
        })
    }
}  

//Delete Function (DELETE)
exports.delete = function(db, obj, cb){
    sql = `SELECT * FROM SailingAdventure.sailors WHERE S_Id = \'${obj.S_Id}\'`;
    db.query(sql, (err,results)=>{
        if (err){
            cb(err.message);
        }
        else if (results.length === 0){
            results = "Record Not Found"
            cb(results);
        }
        else{
            sql = `DELETE FROM SailingAdventure.sailors WHERE`;
            let values = [];
            sql += ` S_Id = ?`;
            values = [obj.S_Id];
            db.query(sql, values, (err, results)=>{
                if (err) throw err;
                results = "Delete Successful"
                cb(results);
            })
        }
    })
}

//Update Function (PUT)
exports.update = function(db, obj, cb){
    sql = `SELECT * FROM SailingAdventure.sailors WHERE S_Id = \'${obj.S_Id}\'`;
    db.query(sql, (err,results)=>{
        if (err){
            cb(err.message);
        }
        else if (results.length === 0){
            results = "Record Not Found"
            cb(results);
        }
        else{
            let keys = Object.keys(obj);
            const name = keys.includes('S_name')? obj.S_name: results[0].S_name;
            const date = keys.includes('B_date')? obj.B_date: results[0].B_date;
            const rate = keys.includes('Rate')? obj.Rate: results[0].Rate;
            sql = `UPDATE SailingAdventure.sailors SET S_name = ?, B_date = ?, Rate = ? WHERE S_Id = ?`;
            db.query(sql, [name, date, rate, obj.S_Id], (err, results)=>{
                if (err) throw err;
                results = "Update Successful"
                cb(results);
            })
        }
    })
}

