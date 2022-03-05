Overview 
================================

We introduce the **Bank Web Application** in this and other sections.
This app is developed using ``Next.js``.
It resides in the ``bank-web-app`` directory.

Project Structure
------------------

Here is the structure of the **Bank Web Application**: ::

    bank-web-app
    |--components
    |--node_modules
    |--pages
    |--public
    |--stores
    |--styles
    |--util
    |--package.json

* ``components`` - Application components.
* ``node_modules`` - Node modules.
* ``pages`` - Pages with dynamic routes.
* ``public`` - Static files.
* ``stores`` - Application context files.
* ``styles`` - Default style files.
* ``util`` - Utility scripts.
* ``package.json`` - Project dependencies and configurations.

Project Dependencies
--------------------

The project dependencies as defined in the ``package.json`` file: ::

    "dependencies": {
        "@ant-design/icons": "^4.7.0",
        "antd": "^4.16.13",
        "lodash": "^4.17.21",
        "next": "11.1.2",
        "prop-types": "^15.7.2",
        "react": "17.0.2",
        "react-dom": "17.0.2",
        "web3": "^1.5.2"
    },

* ``@ant-design/icons`` - Ant design icon modules.
* ``antd`` - Ant design dependency. Ant design is an enterprice-class UI design language and React UI design library.
* ``lodash`` - Javascript utility library for working with objects.
* ``next`` - React application framework.
* ``prop-types`` - Runtime type checking for React props and similar objects.
* ``react`` - React dependency.
* ``react-dom`` - React DOM dependecy.
* ``web3`` - Ethereum Javascript API to interact with Ethereum blockchain smart contracts.

Prerequisites
-------------

1. Blockchain - Before we run the Bank Web Application, we must first deploy all the smart contracts in an Ethereum blockchain 
and configure smart contract related data (contract instance addresses and ABIs) in the application so that deployed smart contracts can be used.

2. Bank Web Server - The Bank Web Application accepts requests from users and passes them to the Bank Web Server to be handled.  As such, it must be connected to an active
Bank Web Server. If the Bank Web Server is running in a different host or port, we need to configure in the ``next.config.js`` file in the ``bank-web-app`` directory: ::

    module.exports = {
        reactStrictMode: true,
        env: {
            API_URL: 'http://localhost:9091/',
        },
    };

You can change the ``API_URL`` value so that the Bank Web Application knows where to pass request to (the Bank Web Server).

The next two sections set up the contexts for the bank web app.  We have a user role context and a smart contract context to be set up.  