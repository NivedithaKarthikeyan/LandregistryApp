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
        ropsten: {
        provider: function() {
            return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${projectId}`)
        },
        network_id: 3,
        gas: 5500000,        // Ropsten has a lower block limit than mainnet
        confirmations: 2,    // # of confs to wait between deployments. (default: 0)
        timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
        skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
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

As describe in the :ref:`deploy-to-ropsten` first we add ``secrets.json`` file and ``hdwallet-provider`` dependency.
Then configure the ``networks`` to development and Ropsten test networks.

Then we config the compilers for the project. We use ``0.8.1`` compiler version in our project.

