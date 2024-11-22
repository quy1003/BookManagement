import { Response, Request } from "express"
const express = require('express')
const app = express()
const morgan = require('morgan')
const port = 3000
const route = require('./routes/index');
const db = require('./config/dbconnect');
const cors = require('cors');
const { swaggerUi, swaggerDocs } = require('./config/swagger');
const {mongoose} = require('mongoose')

//Use Utility
app.use(morgan('combined'))
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
require('dotenv').config()

db.connect();
route(app);
//

app.get('/', (req:Request, res:Response) => {
  res.send('Book Management API')
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${port}`)
})
