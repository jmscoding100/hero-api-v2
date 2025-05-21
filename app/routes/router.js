const express = require('express')
const router = express.Router()
const axios = require('axios')
const PORT = process.env.PORT || 3000

router.use(express.static('public'))

//Root Route => localhost:3000/api
router.get('/api', (req, res) => {
    res.json({
        'Heroes': `http://localhost:${PORT}/api/hero`,
        'Franchises': `http://localhost:${PORT}/api/franchise`,
        'Powers': `http://localhost:${PORT}/api/power`,
        'Species': `http://localhost:${PORT}/api/species`,
        'Teams': `http://localhost:${PORT}/api/team`
    })
})

/**Forms */

//heroForm
router.get('/heroForm', (req, res)=>{
    res.render('pages/heroForm', {
        title: 'Hero Form',
        name: 'Add a Hero',
        endpoints
    })
})

//powerForm
router.get('/powerForm/:heroId', (req, res)=>{
    const heroId = req.params.heroId

    axios.get(`http://localhost:${PORT}/api/power`)
        .then(resp =>{
            res.render('pages/powerForm', {
                title: 'Power Form',
                name: 'Add Powers',
                endpoints,
                heroId,
                powers: resp.data
            })
        })

})

//rivalForm
router.get('/rivalForm/:heroId', (req, res)=>{
    const heroId = req.params.heroId

    axios.get(`http://localhost:${PORT}/api/hero`)
        .then(resp =>{
            res.render('pages/rivalForm', {
                title: 'Rival Form',
                name: 'Add Rivals',
                endpoints,
                heroId,
                rivals: resp.data
            })
        })
})

//imageForm
router.get('/hero-add-image/:hero/:heroId', (req, res)=>{
    const hero = req.params.hero
    const heroId = req.params.heroId

    res.render('pages/imageForm', {
        title: 'Image Form',
        name: 'Add Image',
        hero,
        heroId,
        endpoints
    })
})



//**Pages */

const endpoints = [
    'hero',
    'power',
    'species',
    'franchise',
    'team'
]

//get hero count
let heroCount = 0

axios.get(`http://localhost:${PORT}/api/hero/count`).then(resp=> heroCount = resp.data.count)

endpoints.forEach(endpoint => {
    router.use(`/api/${endpoint}`, require(`./api/${endpoint}Routes`))
})

//home page
router.get('/', (req, res)=>{
    //res.render(path => where are we rendering, obj => what are we rendering)
    res.render('pages/home', {
        title: 'Home',
        name: 'My Hero Website',
        endpoints
    })
})

for(let i = 0; i < endpoints.length; i++){
// do stuff
const endpoint = endpoints[i]
// if endpoints [i] == 'hero'

    if(endpoint == 'hero'){
        router.get(`/${endpoint}`, (req, res)=>{

            const url = `http://localhost:${PORT}/api/${endpoint}`

            axios.get(url)
            .then(resp =>{
                res.render('pages/allHero', {
                    title: 'All Heroes',
                    name: 'All Heroes',
                    data: resp.data,
                    endpoints
                })
            })
        })


        router.get(`/${endpoint}/:id`, (req, res)=>{
            const id = req.params.id

            const url = `http://localhost:${PORT}/api/${endpoint}/${id}`

            axios.get(url)
            .then(resp => {
                let heroName = resp.data.hero_name == null ? `${resp.data.first_name} ${resp.data.last_name}`: resp.data.hero_name

                res.render('pages/heroSingle', {
                    title: heroName,
                    name: heroName,
                    data: resp.data,
                    count: heroCount,
                    endpoints
                })
            })
        })
    } else{
        router.get(`/${endpoint}`, (req, res)=>{
            const url = `http://localhost:${PORT}/api/${endpoint}`

            axios.get(url)
                .then(resp =>{
                    res.render('pages/allData', {
                        title: endpoint,
                        name: endpoint,
                        data: resp.data,
                        endpoints,
                        category: endpoint
                    })
                })
        })

        router.get(`/${endpoint}/:node`, (req, res)=>{
            const node = req.params.node

            const url = `http://localhost:${PORT}/api/${endpoint}/${endpoint}/${node}`

            axios.get(url)
                .then(resp =>{
                    res.render('pages/dataSingle', {
                        title: node,
                        name: node,
                        data: resp.data,
                        endpoints
                    })
                })
        })
    }

    //404 error => any path not listed above
    // router.all('/{*any}', (req, res)=>{
    //     // res.send('<h1>404 Error. This page does not exist.</h1>')
    //     res.render('pages/404', {
    //         title: '404',
    //         name: '404',
    //         endpoints
    //     })
    // })
}





module.exports = router