const con = require('../../config/dbconfig')

const daoCommom = {
    findAll: (res, table)=> {
        con.execute(
            `SELECT * FROM ${table};`,
            (error, rows)=>{
                if(!error){
                    //do stuff
                    if(rows.length === 1){
                        res.json(...rows)
                    } else{
                        res.json(rows)
                    }
                } else {
                    // do something eles
                    console.log('DAO ERROR: ', error)
                }
            }
        )
    },

    findById : (res, table, id)=>{
        con.execute(
            `SELECT * FROM ${table} WHERE ${table}_id = ?;`,
            [id],
            (error, rows)=>{
                if(!error){
                    //do stuff
                    if(rows.length === 1){
                        res.json(...rows)
                    } else{
                        res.json(rows)
                    }
                } else {
                    // do something eles
                    console.log('DAO ERROR: ', error)
                }
            }
        )
    },

    countAll: (res, table)=>{
        con.execute(
            `SELECT COUNT(*) count FROM ${table};`,
            (error, rows)=>{
                if(!error){
                    //do stuff
                    if(rows.length === 1){
                        res.json(...rows)
                    } else{
                        res.json(rows)
                    }
                } else {
                    // do something eles
                    console.log('DAO ERROR: ', error)
                }
            }
        )
    }
}

module.exports = daoCommom