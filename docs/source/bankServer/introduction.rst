Overview of Bank Web Server
=======================

This section describes important functions of the **Bank Web Server**.
Bank Web Server refers to the project ``bank-server``which is developed using ``Node.js``.

Project Structure
-----------------

Here is the structure of the Bank Web Server. ::

    bank-web-app
    |--models
    |--node_modules
    |--routes
    |--services
    |--index.js
    |--package.json

* ``models`` - Directory for the Web Server models which are store the data in MongoDB.
* ``node_modules`` - Directory of node modules.
* ``routes`` - Directory of routes.
* ``services`` - Directory of services which will perform the server side computations.
* ``index.js`` - Starting point of the application. Handles routes.
* ``package.json`` - Project dependencies and configurations.

Project Dependencies
--------------------

Here are the project dependencies defined inside the ``package.json`` file. ::

    "dependencies": {
        "cors": "^2.8.5",
        "express": "^4.17.1",
        "mongoose": "^6.0.0",
        "nodemon": "^2.0.12",
        "swagger-jsdoc": "^6.1.0",
        "swagger-ui-express": "^4.1.6"
    }

* ``cors`` -  Middleware that can be used to enable CORS with various options. CORS: Cross-Origin Resource Sharing 
* ``express`` - Web framework for node.
* ``mongoose`` -  MongoDB object modeling tool
* ``nodemon`` - Tool that helps automatically restarting the node application when file changes in the directory are detected.
* ``swagger-jsdoc`` - This library reads your JSDoc-annotated source code and generates an OpenAPI (Swagger) specification.
* ``swagger-ui-express`` - This module allows you to serve auto-generated swagger-ui generated API docs from express.


Prerequisites
-------------

Mongo DB - Run MongoDB on your machine before you start the **Bank Web Server**.
You can refer :ref:`mongo db install target` section to install and run the MongoDB in your computer.




