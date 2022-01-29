const Express = require('express') // web server is a node server - Bank server
const mongoose = require('mongoose') // web server connects to MongoDB
const cors = require('cors') //

const swaggerUi = require('swagger-ui-express') // present APIs nicely on one pages
const swaggerJsDoc = require('swagger-jsdoc') // present APIs nicely on one pages

//SWAGGER
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Bank API",
            version: "1.0.0",
            description: "Bank API for Microfinance"
        },
        servers: [
            {
                url: "http://localhost:9091"
            }
        ],
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options)

const app = Express()

//Import Routed
const plansRoute = require('./routes/plans');
const paymentsRoute = require('./routes/payments');

//MIDDLEWARE
app.use(cors())

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.use('/loan-plans', plansRoute);
app.use('/loan-payments', paymentsRoute);

//ROUTES
app.get('/', (req, res) => {  // app.get is called when user enters localhost:9091 in browser
    res.send('Welcome to Bank Server') // '/' means no futher route beyond localhost:9091
})

//Connect to DB
const url = 'mongodb://127.0.0.1:27017/bank-db-level1'
mongoose.connect(
    url,
    { useNewUrlParser: true },
    () => {
        console.log('connected to Bank DB')
    })


//LISTENING
app.listen(9091)
