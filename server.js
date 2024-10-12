import express from 'express'
import dotenv from "dotenv"
import dbConnection from './databases/dbConnection.js'
dotenv.config()
import cors from 'cors';
import morgan from 'morgan';
import { init } from './src/modules/index.js';

const app = express();

const port = 3000

// Define allowed domains
const allowedDomains = [
    process.env.FRONT_URL,
    process.env.DASH_URL,
    "https://ecommerco.vercel.app",
    'https://stripe.com',
"https://checkout.stripe.com",
  'https://*.stripe.com' ,
    "http://localhost:3000"
    
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedDomains.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static("uploads"))
app.use(express.urlencoded({extended:true}));

dbConnection()
app.use(morgan("dev"))



init(app)




app.listen(process.env.PORT ||  port, () => console.log(`Example app listening on port ${port}!`))

process.on("unhandledRejection",(err)=>{
    console.log(err);
}) 
