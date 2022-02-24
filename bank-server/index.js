const Express = require('express') // Web framework for node js.
const mongoose = require('mongoose') // MongoDB object modeling tool
const cors = require('cors') // Express middleware that can be used to enable CORS.
const swaggerUi = require('swagger-ui-express') // This library reads your JSDoc-annotated source code and generates an OpenAPI (Swagger) specification.
const swaggerJsDoc = require('swagger-jsdoc') // This module allows you to serve auto-generated swagger-ui generated API docs from express.

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

const app = Express() // Defines Express web server called app.

//Import Routes
const plansRoute = require('./routes/plans');
const paymentsRoute = require('./routes/payments');

//MIDDLEWARE
app.use(cors()) // Enables CORS for the app.

app.use(Express.urlencoded({ extended: true })); //Parses incoming requests with urlencoded payloads 
app.use(Express.json()) //Parses incoming requests with JSON payloads

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)) // Swagger documentation.

app.use('/loan-plans', plansRoute);
app.use('/loan-payments', paymentsRoute);

//ROUTES
app.get('/', (req, res) => {  // app.get is called when user enters localhost:<PORT> in browser
    res.send('Welcome to Bank Server') // '/' means no futher route beyond localhost:<PORT>
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
