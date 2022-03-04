index.js
========

As indicated in the ``package.json`` file, when we start the ``bank-server`` app, it will start running from the ``index.js`` file. ::

    "scripts": {
        "start": "nodemon index.js",
        ...
    }

In ``index.js``, first we import the dependencies that are needed to run the ``bank-server``. ::

    const Express = require('express')
    const mongoose = require('mongoose') 
    const cors = require('cors')
    const swaggerUi = require('swagger-ui-express')
    const swaggerJsDoc = require('swagger-jsdoc')

Then we define some configurations for the Swagger API documentation. ::

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

Next we define an Express web server called ``app`` as follows. ::
    
    const app = Express()

We define routes in separate files. Each route handles a client request.  In web development, a route directs the request to the code that handles it.  We need to import them into the ``index.js`` file to use them.
In this project, we define two routes ``/loan-plans`` and ``/loan-payments`` to handle loan requests and payment requests from the web app.
Requests will be handled by the two scripts in the ``routes`` directory: ::

    //Import Routes
    const plansRoute = require('./routes/plans');
    const paymentsRoute = require('./routes/payments');

We enable some pre-defined Express middleware to enable the CORS, handle URLEncoding payloads and json payloads in the **Bank Web Server**. ::

    //MIDDLEWARE
    app.use(cors()) // Enable CORS for the app.
    app.use(Express.urlencoded({ extended: true })); //Parse incoming requests with urlencoded payloads 
    app.use(Express.json()) //Parse incoming requests with JSON payloads

We enable Swagger API documentation in ``/api-docs`` route as follows. ::

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)) // Swagger documentation.

The following two lines redirect any request to the ``/loan-plans`` and ``/loan-payments`` 
to the respective scripts: ::

    app.use('/loan-plans', plansRoute);
    app.use('/loan-payments', paymentsRoute);

We send a ``Welcome to Bank Server`` message to any request to the root route here: :: 

    app.get('/', (req, res) => {  // app.get is called when user enters localhost:<PORT> in browser
        res.send('Welcome to Bank Server') // '/' means no futher route beyond localhost:<PORT>
    })

The following code connects the **Bank Web Server** to the MongoDB. ::
    
    //Connect to DB
    const url = 'mongodb://127.0.0.1:27017/bank-db-level1'
    mongoose.connect(
        url,
        { useNewUrlParser: true },
        () => {
            console.log('connected to Bank DB')
    })

The **Bank Web Server** connects to port ``9091``: ::

    app.listen(9091)
