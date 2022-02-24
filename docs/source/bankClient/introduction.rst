Overview of Bank Web Application
================================

This section describes the important functions of the ``Bank Web Application``.
**Bank Web Application** developed using ``Next.js``.
It's resides inside the ``bank-web-app`` directory.

Project Structure
------------------

Here is the structure of the Bank Web Application. ::

    bank-web-app
    |--components
    |--node_modules
    |--pages
    |--public
    |--stores
    |--styles
    |--package.json

* ``components`` - Directory for the application components.
* ``node_modules`` - Directory of node modules.
* ``pages`` - Directory of pages with dynamic routes.
* ``public`` - Directory of static files.
* ``stores`` - Directory of Application Context files.
* ``styles`` - Default style files.
* ``package.json`` - Project dependencies and configurations.

Project Dependencies
--------------------

Here are the project dependencies defined inside the ``package.json`` file. ::

    "dependencies": {
        "antd": "^4.16.13",
        "next": "11.1.0",
        "react": "17.0.2",
        "react-dom": "17.0.2",
        "web3": "^1.5.2"
    },

* ``antd`` - Ant design dependency. Ant design is a enterprice-class UI design language and React UI design library.
* ``next`` - Application framework.
* ``react`` - React dependency.
* ``react-dom`` - React DOM dependecy.
* ``web3`` - Dependecny to interact with Ethereum blockchain smart contracts.

Prerequisites
-------------

1. Blockchain - Before run the Bank Web Application we have to deploy all the contracts to the Ethereum blockchain 
and configure smart contract related data(contract addresses and abi) within the application.

2. Bank Web Server - Bank web application connects to Bank web server. It's better to connects the Bank web apllication to active
Bank web server. If the Bank web server running in a different host or post config them properly in the files.

You can confi Bank web server host and port in ``next.config.js`` file placed inside the ``bank-web-app`` directory. ::

    module.exports = {
        reactStrictMode: true,
        env: {
            API_URL: 'http://localhost:9091/',
        },
    };

You can change the ``API_URL`` value to connect the Bank web application to Bank web server.

