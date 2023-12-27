/*
Title: Assignment 4
Description: Sailing Adventure SQL
Name: Rayyan Dirie
Date: 12/03/2023
Section: 001
*/

//Add Function (POST)
exports.add = function(db, obj,cb){
    let sql = `INSERT INTO SailingAdventure.boats`;
    let values = [];
    sql += `(B_name, Type)
    VALUES(?,?)`;
    values = [obj.B_name, obj.Type];
    db.query(sql,values, (err)=>{
        if (err) throw err;
        cb(200);
    })
}

//Display Function (GET)
exports.display = function(db, cb){
    let sql = `SELECT B_Id, B_Name, Type FROM SailingAdventure.boats`;
    db.query(sql, (err,results)=>{
        if (err) throw err;
        let output = "";
        results.forEach(element => {
            output += JSON.stringify(element);
            output = output.replace("{\"B_Id\":","")
            output = output.replace(",\"B_Name\":\""," ")
            output = output.replace("\",\"Type\":\"", " ")
            output = output.replace("\"}","\n")
        });
        cb(output);
    })
}

//Display All Boats of a given Type
exports.type = function(db, obj, cb){
    if(obj.Type == null){
        cb(400,"Please enter a valid Type")
    }
    else{
        let sql = `Call SailingAdventure.boatType(?);`;
        db.query(sql, [obj.Type], (err, results)=>{
            if (err) throw err;
                let output = "";
                let newResults = results[0];
                for(let i = 0; i < newResults.length; i++){
                    output += JSON.stringify(newResults[i]);
                    output = output.replace("{\"B_Id\":","")
                    output = output.replace(",\"B_Name\":\""," ")
                    output = output.replace("\"}","\n")
                };
            cb(200, output);
        })
    }
}

//Count All Boats of a given Type
exports.count = function(db, obj, cb){
    if(obj.Type == null){
        cb(400,"Please enter a valid Type")
    }
    else{
        let sql = `Call SailingAdventure.boatCount(?, @counter); SELECT @counter;`;
        db.query(sql, [obj.Type], (err, results)=>{
            if (err) throw err; 
            cb(200, "The number of " + [obj.Type] + " boats is " + results[1][0]['@counter']);
        })
    }
}

//Delete Function (DELETE)
exports.delete = function(db, obj, cb){
    sql = `SELECT * FROM SailingAdventure.boats WHERE B_Id = \'${obj.B_Id}\'`;
    db.query(sql, (err,results)=>{
        if (err){
            cb(err.message);
        }
        else if (results.length === 0){
            results = "Record Not Found"
            cb(results);
        }
        else{
            sql = `DELETE FROM SailingAdventure.boats WHERE`;
            let values = [];
            sql += ` B_Id = ?`;
            values = [obj.B_Id];
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
    sql = `SELECT * FROM SailingAdventure.boats WHERE B_Id = \'${obj.B_Id}\'`;
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
            const name = keys.includes('B_name')? obj.B_name: results[0].B_name;
            const type = keys.includes('Type')? obj.Type: results[0].Type;
            sql = `UPDATE SailingAdventure.boats SET B_name = ?, Type = ? WHERE B_Id = ?`;
            db.query(sql, [name, type, obj.B_Id], (err, results)=>{
                if (err) throw err;
                results = "Update Successful"
                cb(results);
            })
        }
    })
}