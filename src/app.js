const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require("./utils/forecast")

const app = express()
//Define paths for Express config
const publicDirectorypath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates')
const partialsPath = path.join(__dirname,'../templates/partials')

// Setup handlers engine and views location 
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to server
app.use(express.static(publicDirectorypath))


app.get('',(req,res) =>{
    res.render('index', {
        title: 'Weather App',
        name: 'Aish'
    })
})
app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About',
        name:'Aish'
    })
})
app.get('/help',(req,res)=>{
    res.render('help',{
        title:'Help',
        name:'Aish'
    })
})
app.get('/weather',(req,res)=> {
    if(!req.query.address){
        return res.send({
            error: "You must provide an address"
        })
    }
    geocode(req.query.address,(error , {latitude,longitude,location} = {}) =>{
        if(error){
            return res.send({error})
        }

        forecast(latitude,longitude,(error,forecastdata) => {
            if(error){
                return res.send({error })
            }

            res.send({
                forecast: forecastdata,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products',(req,res) =>{
    if(!req.query.search){
        return res.send({
            error: "You must provide a search term"
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('*',(req,res)=>{
    res.render('404-page',{
        title:'404'
    })
})

app.listen(3000,()=> {
    console.log('Server is up on port 3000.')
})