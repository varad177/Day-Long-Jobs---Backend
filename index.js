


import express from'express'
import Router from './route/route.js'
import cors from 'cors'
import bodyParser from 'body-parser'
//is router ko ham app component ke sath use kar skte hai 
import connection from './database/db.js'

import dotenv from "dotenv"
dotenv.config()



const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json({extended : true}))
app.use(bodyParser.urlencoded({extended : true}))

app.use('/' , Router)


app.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}`);
})

connection()