/*
Title: Assignment 4
Description: Sailing Adventure SQL
Name: Rayyan Dirie
Date: 12/03/2023
Section: 001
*/

//Add Reservations if the Sailor Rate matches the Boat Type(POST)
exports.add = function(db, obj,cb){
    let sql = `Call SailingAdventure.addReserve(?,?,?,@reserveStatus); SELECT @reserveStatus`;
    db.query(sql,[obj.S_Id, obj.B_Id, obj.Day], (err,results)=>{
        if (err) {
            cb(400, JSON.stringify(err.message));
        }
        else{
            cb(200, results[1][0]['@reserveStatus']);
        }
    })
}

//Display Function (GET)
exports.display = function(db, cb){
    let sql = `USE SailingAdventure`;
    db.query(sql, (err)=>{
        if (err) throw err;
    })
    sql = `SELECT sailors.S_Id, sailors.S_name, boats.B_Id, boats.B_name, Day FROM SailingAdventure.reserves 
    INNER JOIN boats ON boats.B_Id = reserves.B_Id 
    INNER JOIN sailors ON sailors.S_Id = reserves.S_Id`;
    db.query(sql, (err,results)=>{
        if (err) throw err;
        let output = "";
        results.forEach(element => {
            output += JSON.stringify(element);
            output = output.replace("{\"S_Id\":","")
            output = output.replace(",\"S_name\":\""," ")
            output = output.replace("\",\"B_Id\":"," ")
            output = output.replace(",\"B_name\":\""," ")
            output = output.replace("\",\"Day\":\"", " ")
            output = output.replace("T04:00:00.000Z\"}", "")
        });
        cb(output);
    })
}

//Display All Reservations before a given Day
exports.before = function(db, obj, cb){
    if(obj.Day == null || obj.Day == ''){
        cb(400, 'Please Enter Valid Reserve Day');
    }
    else{
        let sql = `Call SailingAdventure.reserveBefore(?);`;
        db.query(sql, [obj.Day], (err,results)=>{
            if (err) throw err;
            let output = "";
            let newResults = results[0];
            for(let i = 0; i < newResults.length; i++){
                output += JSON.stringify(newResults[i]);
                output = output.replace("{\"B_Id\":","")
                output = output.replace(",\"B_name\":\""," ")
                output = output.replace("\",\"DATE_FORMAT(reserves.Day, \\\"%a %b %d %Y\\\")\":\"", " ")
                output = output.replace("\"}","\n")
            };
            cb(200, output);
        })
    }
}

//Display All Reservations after a given Day
exports.after = function(db, obj, cb){
    if(obj.Day == null || obj.Day == ''){
        cb(400, 'Please Enter Valid Reserve Day');
    }
    else{
        let sql = `Call SailingAdventure.reserveAfter(?);`;
        db.query(sql, [obj.Day], (err,results)=>{
            if (err) throw err;
            let output = "";
            let newResults = results[0];
            for(let i = 0; i < newResults.length; i++){
                output += JSON.stringify(newResults[i]);
                output = output.replace("{\"B_Id\":","")
                output = output.replace(",\"B_name\":\""," ")
                output = output.replace("\",\"DATE_FORMAT(reserves.Day, \\\"%a %b %d %Y\\\")\":\"", " ")
                output = output.replace("\"}","\n")
            };
            cb(200, output);
        })
    }
}

//Delete Function (DELETE)
exports.delete = function(db, obj, cb){
    let sql = `SELECT * FROM SailingAdventure.reserves WHERE`;
    let values = [];
    sql += ` S_Id = ? AND B_Id = ? AND Day = ?`;
    values = [obj.S_Id, obj.B_Id, obj.Day];
    db.query(sql, values, (err,results)=>{
        if (err){
            cb(err.message);
        }
        else if (results.length === 0){
            results = "Record Not Found"
            cb(results);
        }
        else{
            console.log(results);
            sql = `DELETE FROM SailingAdventure.reserves WHERE`;
            values = [];
            sql += ` S_Id = ? AND B_Id = ? AND Day = ?`;
            values = [obj.S_Id, obj.B_Id, obj.Day];
            db.query(sql, values, (err,results)=>{
                if (err) throw err;
                results = "Delete Successful";
                cb(results);
            })
        }
    })
}
