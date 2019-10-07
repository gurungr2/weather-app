const path = require('path')
const express = require('express')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const hbs = require('hbs')

const app = express()

//Define paths for express configuration
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Ramesh Gurung'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Ramesh Gurung'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is a help page',
        title: 'Help',
        name: 'Ramesh Gurung'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.status(200)
            .send({
            error: "Please provide an address"
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
           return res.send({
               error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: "Error!!!"})
            }
            
            res.status(200)
                .send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
          })
    })
})

app.get('/products', (req, res, next) => {
    if (!req.query.search): return next("You must provide a search term");
    res.status(200)
        .send({
        products: []
    })
})

app.get('/help/*', (req,res, next) => {
    res.render('404', {
        title: '404',
        name: 'Ramesh Gurung',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res, next) => {
    res.render('404', {
        title: '404',
        name: 'Ramesh Gurung',
        errorMessage: 'Page not found'
    })
})

 app.use((err, req, res, next) => {
        console.log(err);
        res.status(400)
            .send({ success: false, message: err.message || err });
      }
    );

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})
