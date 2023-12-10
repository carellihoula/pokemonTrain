const express  = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const app = express()
const sequelize = require('./src/db/sequelize')
require('dotenv').config()

app
.use(favicon(__dirname + '/favicon.ico'))
//.use(morgan('dev')) 
.use(bodyParser.json())

sequelize.initDb()


//Ici nooous placerons nos futurs points de terminaisons
app.get('/', function(req, res){
    res.json("Hello World!")
})
app.use('/api/pokemons', require('./src/routes/pokemons.router'))
app.use('/api/login', require('./src/routes/login.router'))

app.use((res) => {
    const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL'
    res.statusCode(404).json({message})
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log('listening on port '+process.env.PORT || 3000)
})