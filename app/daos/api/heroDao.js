const fs = require('fs')
const path = require('path')
const con = require('../../config/dbconfig')

const heroDao = {
    table: 'hero',

    findHeroes: (res, table)=> {
        con.execute(
            `SELECT ${table}.hero_id, ${table}.hero_name, ${table}.first_name,
            ${table}.last_name, ${table}.alias, f.franchise, s.species, 
            ${table}.place_of_origin, ${table}.first_app, ${table}.alignment, ${table}.img_url
            FROM ${table}
            JOIN franchise f USING (franchise_id)
            JOIN species s USING (species_id)
            ORDER BY ${table}.hero_id;`,
            (error, rows)=> {
                if (!error) {
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log('Hero Dao Error: ', error)
                }
            }
        )
    },

    findHeroById: (res, table, id)=> {
        let powers = []
        let rivals = []

        con.execute(
            `SELECT h.hero_id, p.power
            FROM hero h
            JOIN hero_to_power hp ON h.hero_id = hp.hero_id
            JOIN power p ON p.power_id = hp.power_id
            WHERE h.hero_id = ${id};`,
            (error, rows)=> {
                if (!error) {
                    Object.values(rows).forEach(obj => {
                        powers.push(obj.power)
                    })
                    con.execute(
                        `SELECT h1.hero_id, 
                        CASE WHEN h1.hero_name IS NULL THEN concat(h1.first_name, ' ',h1.last_name)
                        ELSE h1.hero_name
                        END hero,
                        CASE WHEN h2.hero_name IS NULL THEN concat(h2.first_name, ' ',h2.last_name)
                        ELSE h2.hero_name
                        END rival
                        FROM hero_to_rival hr 
                        JOIN hero h1 ON h1.hero_id = hr.hero_id
                        JOIN hero h2 ON h2.hero_id = hr.rival_id
                        WHERE h1.hero_id = ${id};`,
                        (error, rows)=> {
                            if (!error) {
                                Object.values(rows).forEach(obj => {
                                    rivals.push(obj.rival)
                                })

                                con.execute(
                                    `SELECT h.hero_id, 
                                    h.hero_name, h.first_name,
                                    h.last_name, h.alias, 
                                    f.franchise, s.species, h.place_of_origin, 
                                    h.first_app, h.alignment, h.img_url
                                    FROM hero h
                                    JOIN franchise f USING (franchise_id)
                                    JOIN species s USING (species_id)
                                    WHERE h.hero_id = ${id};`,
                                    (error, rows)=> {
                                        rows.forEach(row => {
                                            row.powers = powers
                                            row.rivals = rivals
                                        })

                                        if (!error) {
                                            if (rows.length === 1) {
                                                res.json(...rows)
                                            } else {
                                                res.json(rows)
                                            }
                                        } else {
                                            console.log(`DAO Error: ${table} `, error)
                                        }
                                    }
                                )
                            }
                        }
                    )
                } else {
                    console.log(error)
                }
            }
        )
    },

    findHeroByAlignment: (res, table, alignment) =>{
        con.execute(
            `SELECT ${table}.hero_id, ${table}.hero_name, ${table}.first_name,
            ${table}.last_name, ${table}.alias, f.franchise, s.species, 
            ${table}.place_of_origin, ${table}.first_app, ${table}.alignment, ${table}.img_url
            FROM ${table}
            JOIN franchise f USING (franchise_id)
            JOIN species s USING (species_id)
            WHERE ${table}.alignment = '${alignment}'
            ORDER BY ${table}.hero_id;`,
            (error, rows) =>{
                if(!error){
                    if(rows.length === 1){
                        res.json(...rows)
                    }else {
                        res.json(rows)
                    }
                }else {
                    console.log(`DAO ERROR: ${table}`, error)
                }
            }
        )
    },

    sort:(res, table)=>{
        con.execute(
            `SELECT ${table}.hero_id, ${table}.hero_name, ${table}.first_name,
            ${table}.last_name, ${table}.alias, f.franchise, s.species, 
            ${table}.place_of_origin, ${table}.first_app, ${table}.alignment, ${table}.img_url
            FROM ${table}
            JOIN franchise f USING (franchise_id)
            JOIN species s USING (species_id)
            ORDER BY ${table}.hero_name, ${table}.last_name, ${table}.first_name;`,
            (error, rows)=> {
                if (!error) {
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log('Hero Dao Error: ', error)
                }
            }
        )
    },

    addPowers: (req, res, id)=>{

        const data = req.body.power_id.map(item => {
            return {"hero_id": id, "power_id": item }
        })

        data.forEach(obj => {
            con.execute(
                `INSERT INTO hero_to_power (hero_id, power_id)
                VALUES (${obj.hero_id}, ${obj.power_id});`,
                (error, dbres)=>{
                    if(error){
                        res.send(error)
                    }
                }
            )
        })

        res.send('<h1>Posted</h1>')
    },

    addRivals: (req, res, id)=>{

        const data = req.body.rival_id.map(item => {
            return {"hero_id": id, "rival_id": item }
        })

        data.forEach(obj => {
            con.execute(
                `INSERT INTO hero_to_rival (hero_id, rival_id)
                VALUES (${obj.hero_id}, ${obj.rival_id});`,
                (error, dbres)=>{
                    if(error){
                        res.send(error)
                    }
                }
            )
        })

        res.send('<h1>Posted</h1>')
    },


    update: (req, res, table)=>{
        if(isNaN(req.params.id)){
            res.json({
                "error": true,
                "message": "Id must be a number"
            })
        } else if (Object.keys(req.body).length === 0){
            res.json({
                "error": true,
                "message": "No fields to update"
            })
        } else {

            const fields = Object.keys(req.body)
            const values = Object.values(req.body)

            con.execute(
                `UPDATE ${table}
                    SET ${fields.join(' = ?, ')} = ? WHERE ${table}_id = ?;`,
                    [...values, req.params.id],
                    (error, dbres)=>{
                        if(!error){
                            res.send(`Changed ${dbres.changedRows} row(s)`)
                        } else {
                            console.log(`${table}Dao error:`, error)
                            res.send('Error creating change')
                        }
                    }
            )
            const addFile = (dirPath, fileName, fileContent)=>{
                const filePath = path.join(dirPath, fileName)

                if(!fs.existsSync(dirPath)){
                    fs.mkdirSync(dirPath, {recursive: true})
                }

                fs.writeFileSync(filePath, fileContent)
                console(`File "${fileName} added to directory ${dirPath}`)
                
            }
            const directoryPath = 'images'
            const newFileName = values[0]

            addFile(directoryPath, newFileName)
        }
    }
}

module.exports = heroDao