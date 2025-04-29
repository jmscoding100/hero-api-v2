const con = require('../../config/dbconfig')

const speciesDao = {
    table: 'species',

    findSpecies: (res,  table)=> {
        con.execute(
            `SELECT * FROM species;`,
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

    findHeroesBySpecies: (res, table, species)=> {
        con.execute(
            `SELECT h.hero_id, h.hero_name, h.first_name,
            h.last_name, h.alias, f.franchise, s.species, 
            h.place_of_origin, h.first_app, h.alignment, h.img_url
            FROM hero h
            JOIN franchise f USING (franchise_id)
            JOIN species s USING (species_id)
            WHERE s.species = '${species}'
            ORDER BY h.hero_id;`,
            (error, rows)=> {
                if (!error) {
                    res.json(rows)
                } else {
                    console.log(`DAO Error: ${table}`, error)
                }
            }
        )
    },

    findSpeciesAndAlignment: (res, table, species, alignment)=> {
        con.execute(
            `SELECT h.hero_id, h.hero_name, h.first_name,
            h.last_name, h.alias, f.franchise, s.species, 
            h.place_of_origin, h.first_app, h.alignment, h.img_url
            FROM hero h
            JOIN franchise f USING (franchise_id)
            JOIN species s USING (species_id)
            WHERE s.species = '${species}' AND h.alignment = '${alignment}'
            ORDER BY h.hero_id;`,
            (error, rows)=> {
                if (!error) {
                    res.json(rows)
                } else {
                    console.log(`DAO Error: ${table}`, error)
                }
            }
        )
    }
}

module.exports = speciesDao