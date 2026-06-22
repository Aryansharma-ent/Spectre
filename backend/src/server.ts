import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import path from 'path';
import connectDB from './config/db'
import ErrorHandler from './Middlewares/ErrorHandler'
import TestRunRoutes from './Routes/TestRunRoutes'
import ProjectRoutes from './Routes/ProjectRoutes';
const app = express()
connectDB()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use('/screenshots', express.static(path.join(__dirname, '../Public/screenshots')));
app.use('/api/tests',TestRunRoutes)
app.use('/api/projects',ProjectRoutes)

app.use(ErrorHandler)
app.listen(process.env.PORT,()=>{
    console.log(`Server is running at PORT ...... ${process.env.PORT}` )
})