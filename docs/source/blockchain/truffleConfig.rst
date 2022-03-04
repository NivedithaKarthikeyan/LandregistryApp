Truffle Configuration
======================

Here is the ``truffle-config.js`` script for this project. ::

    const { projectId, mnemonic } = require('./secrets.json');
    const HDWalletProvider = require('@truffle/hdwallet-provider');

    module.exports = {

    networks: {
        development: {
        host: "127.0.0.1",     // Localhost (default: none)
        port: 7545,            // Standard Ethereum port (default: none)
        network_id: "*",       // Any network (default: none)
        },
    },

    // Configure your compilers
    compilers: {
        solc: {
        version: "0.8.1",    // Fetch exact version from solc-bin (default: truffle's version)
        ...
        }
    },
    };

As described in the :ref:`deploy-to-ropsten` section, first we add the ``secrets.json`` file and ``hdwallet-provider`` dependency.
Then we configure the ``networks`` to development and Ropsten test networks.
Next we configure the compilers for the project. We use ``0.8.1`` compiler version in our project.

