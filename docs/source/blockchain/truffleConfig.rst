Truffle Configuration
======================

Here is the ``truffle-config.js`` script for this project. ::

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

We can configure blockchain networks under ``networks`` in ``truffle-config.js`` file.  
This ``development`` network contains our ``Ganache`` local blockchain network configurations.
We can specify the ``network`` we need to deploy our smart contracts using network keyword at the deployment time as follows. ::

    truffle migrate --reset --network development

This command deploys our smart contracts in to the ``development`` network.

Next we configure the compilers for the project. We use ``0.8.1`` compiler version in our project.

