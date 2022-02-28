Overview 
================================

This section describes the important functions of the **Bank Web Application**.
**Bank Web Application** developed using ``Next.js``.
It's resides inside the ``bank-web-app`` directory.

Project Structure
------------------

Here is the structure of the **Bank Web Application**. ::

    bank-web-app
    |--components
    |--node_modules
    |--pages
    |--public
    |--stores
    |--styles
    |--util
    |--package.json

* ``components`` - Directory for the application components.
* ``node_modules`` - Directory of node modules.
* ``pages`` - Directory of pages with dynamic routes.
* ``public`` - Directory of static files.
* ``stores`` - Directory of Application Context files.
* ``styles`` - Default style files.
* ``util`` - Utility scripts.
* ``package.json`` - Project dependencies and configurations.

Project Dependencies
--------------------

Here are the project dependencies defined inside the ``package.json`` file. ::

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

* ``@ant-design/icons`` - Ant design icons module
* ``antd`` - Ant design dependency. Ant design is a enterprice-class UI design language and React UI design library.
* ``lodash`` - Javascript utility library for working with objects.
* ``next`` - React application framework.
* ``prop-types`` - Runtime type checking for React props and similar objects.
* ``react`` - React dependency.
* ``react-dom`` - React DOM dependecy.
* ``web3`` - Ethereum Javascrip API to interact with Ethereum blockchain smart contracts.

Prerequisites
-------------

1. Blockchain - Before run the Bank Web Application we have to deploy all the contracts to the Ethereum blockchain 
and configure smart contract related data(contract addresses and abi) within the application.

2. Bank Web Server - Bank Web Application connects to Bank Web Server.
It's better to connects the Bank Web Apllication to active
Bank Web Server. If the Bank Web Server running in a different host or post config them properly in the files.

You can config Bank Web Server host and port in ``next.config.js`` file placed inside the ``bank-web-app`` directory. ::

    module.exports = {
        reactStrictMode: true,
        env: {
            API_URL: 'http://localhost:9091/',
        },
    };

You can change the ``API_URL`` value to connect the Bank Web Application to Bank Web Server.

