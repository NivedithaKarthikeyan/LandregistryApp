Server Overview 
=======================

This section describes important functions of the **Bank Web Server**.
The Bank Web Server refers to the project and folder ``bank-server``, developed using ``Node.js``.

Project Structure
-----------------

Here is the structure of the Bank Web Server: ::

    bank-server
    |--models
    |--node_modules
    |--routes
    |--services
    |--index.js
    |--package.json

* ``models`` - Web Server data models that are mapped to data in the backend MongoDB.
* ``node_modules`` - Node modules from ``Node.js``.
* ``routes`` - Routes supported by the bank server.  A route is a mechanism where HTTP requests are routed to the code that handles them.  It determines how an app responds to a client request.
* ``services`` - Services provided by the bank server.  Each route has a corresponding service to perform and satisfy the client/HTTP request.
* ``index.js`` - Starting point of the bank server.  It maps incoming requests to routes to services.
* ``package.json`` - Project dependencies and configurations.

Project Dependencies
--------------------

Here are the project dependencies defined in the ``package.json`` file. ::

    "dependencies": {
        "cors": "^2.8.5",
        "express": "^4.17.1",
        "mongoose": "^6.0.0",
        "nodemon": "^2.0.12",
        "swagger-jsdoc": "^6.1.0",
        "swagger-ui-express": "^4.1.6"
    }

* ``cors`` -   CORS is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos.Certain *cross-domain* requests are forbidden by default by the same-origin security policy. CORS defines a way in which a browser and server can interact to determine whether it is safe to allow the cross-origin request. It allows for more freedom and functionality than purely same-origin requests, but is more secure than simply allowing all cross-origin requests.
* ``express`` - Express.js, or simply Express, is a back end web application framework for Node.js. It is designed for building web applications and APIs. It has been called the de facto standard server framework for Node.js.
* ``mongoose`` -  Mongoose is a JavaScript object-oriented programming library that creates a connection between MongoDB and the Express web application framework. It provides a straight-forward, schema-based solution to model your application data.
* ``nodemon`` - Tool that helps automatically restarting the node application when file changes in the directory are detected.
* ``swagger-jsdoc`` - Swagger is an Interface Description Language for describing RESTful APIs expressed using JSON.  This library reads your JSDoc-annotated source code and generates an OpenAPI (Swagger) specification.  With this library, you can document your express endpoints using swagger OpenAPI 3 Specification.
* ``swagger-ui-express`` - This module allows you to serve auto-generated swagger-ui generated API docs from express.


Prerequisites
-------------

Run MongoDB on your machine before you start the **Bank Web Server**. 
You can refer to the :ref:`mongo db install target` section on how to install and run MongoDB in your computer.




