.. _deploy-to-ropsten:

Deploy Smart Contracts to Ropsten
==================================

Dependencies
~~~~~~~~~~~~

You must have Metamask Extension installed. 

Step 1 - Get Fake Ethers for your Account
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. Select Ropsten network in you MetaMask plugin.

.. image:: ../images/select_ropsten_network.png
  :width: 300

2. Navigate to `Ropsten Ethereum Faucet <https://faucet.ropsten.be/>`_ and enter your metamask first account address there 
to have ethers transferred in your account. 

.. image:: ../images/account_copied.png
  :width: 300

You can copy your account address from metamask like this,

.. image:: ../images/ropsten_faucet.png

3. After a few minutes, you’ll see ethers reflected in your account.

.. image:: ../images/ropsten_account_with_eth.png
  :width: 300


Step 2 - Create Infura Project
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. Sign in to `Infura <https://infura.io/>`_.

2. Navigate to Etehereum from left pannel -> CREATE NEW PEOJECT.
Insert a name of the project and create one.

.. image:: ../images/create_infura_project.png
  :width: 300

3. Select "Ropsten" as the Endpoint under the Keys section. Copy the ``PROJECT ID``

.. image:: ../images/infura_project.png

4. Create a secret file

Note in the first line that we are loading the project id and mnemonic from a secrets.json file, 
which should look like the following, but using your own values. Make sure to .gitignore it! ::

    {
        "mnemonic": "planet auto sign choice ...",
        "projectId": "305c137050..."
    }

TIP: Instead of a secrets.json file, you can use whatever secret-management solution you like for your project. 
A popular and simple option is to use dotenv for injecting secrets as environment variables.

We can now test out that this configuration is working by listing the accounts we have available for the Ropsten network. 
Remember that yours will be different, as they depend on the mnemonic you used. ::

    $ truffle console --network ropsten
    truffle(ropsten)> await web3.eth.getAccounts()
    [
    '0xABFf604B340Da8612F07b0d76ef54b2d2A8B611b',
    '0x3e4Cdd143b1C8FFb129Bb81f81B2B8835Ea03Cff',
    ...
    ]
    truffle(ropsten)> await web3.eth.getBalance('0xABFf604B340Da8612F07b0d76ef54b2d2A8B611b')
    '300000000000000000'

Step 3 - Truffle Configurations
-------------------------------

Since we are using public nodes, we will need to sign all our transactions locally. 
We will use ``@truffle/hdwallet-provider`` to do this, setting it up with our ``mnemonic``. 
We will also tell the provider how to connect to the test network by using the Infura endpoint.

Let’s start by installing the provider. ::

    install --save-dev @truffle/hdwallet-provider

``truffle-config.js`` ::

    const { projectId, mnemonic } = require('./secrets.json');
    const HDWalletProvider = require('@truffle/hdwallet-provider');

    module.exports = {

    networks: {
        development: {
            host: "127.0.0.1",     // Localhost (default: none)
            port: 8545,            // Standard Ethereum port (default: none)
            network_id: "*",       // Any network (default: none)
        },
        // Useful for deploying to a public network.
        // NB: It's important to wrap the provider as a function.
        ropsten: {
            provider: function() {
            return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${projectId}`)
            },
            network_id: 3,
            gas: 4000000         // Any network (default: none)
        },
    };



Step 4 - Deploy smart contracts to Ropsten network
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With a project configured to work on a public testnet, we can now finally deploy our contracts. 
The command here, other than specifying the network, is the same as if you were on your local development network, 
though it will take a few seconds to run as new blocks are mined. ::

    truffle migrate --reset --network ropsten

results ::

    Compiling your contracts...
    ===========================
    > Everything is up to date, there is nothing to compile.



    Starting migrations...
    ======================
    > Network name:    'ropsten'
    > Network id:      3
    > Block gas limit: 7999985 (0x7a11f1)


    1_initial_migration.js
    ======================

    Deploying 'Migrations'
    ----------------------
    > transaction hash:    0x875c414b60a931461e1b9237937c4fab11fe0704e3e823b81b7c3da26f421392
    > Blocks: 1            Seconds: 9
    > contract address:    0xf126dfDB4Dc12F7c4A32a2a3712e6E3A085cD7a0
    > block number:        11571309
    > block timestamp:     1638889340
    > account:             0xABFf604B340Da8612F07b0d76ef54b2d2A8B611b
    > balance:             0.283909435512360445
    > gas used:            248204 (0x3c98c)
    > gas price:           1.500000009 gwei
    > value sent:          0 ETH
    > total cost:          0.000372306002233836 ETH

    Pausing for 2 confirmations...
    ------------------------------
    > confirmation number: 1 (block: 11571310)
    > confirmation number: 2 (block: 11571311)

    > Saving migration to chain.
    > Saving artifacts
    -------------------------------------
    > Total cost:     0.000372306002233836 ETH


    2_micro_token_migration.js
    ==========================

    Deploying 'MicroToken'
    ----------------------
    > transaction hash:    0x5faddbdec0653c4fdb6102ba189a999e1d1e8bd7adccca4892c8fdc244793b99
    > Blocks: 2            Seconds: 21
    > contract address:    0xe2b2A7a9CAf0C0c5401493900D7ebC5633F353e8
    > block number:        11571315
    > block timestamp:     1638889478
    > account:             0xABFf604B340Da8612F07b0d76ef54b2d2A8B611b
    > balance:             0.282798142504951825
    > gas used:            694949 (0xa9aa5)
    > gas price:           1.50000001 gwei
    > value sent:          0 ETH
    > total cost:          0.00104242350694949 ETH

    Pausing for 2 confirmations...
    ------------------------------
    > confirmation number: 1 (block: 11571317)
    > confirmation number: 2 (block: 11571318)

    > Saving migration to chain.
    > Saving artifacts
    -------------------------------------
    > Total cost:     0.00104242350694949 ETH


    3_user_identity_migration.js
    ============================

    Deploying 'UserIdentity'
    ------------------------
    > transaction hash:    0x38b64d7be457a7b28765c7d48f6f6adecfced7c1d42ab8c1c0b5d1c83865c53b
    > Blocks: 2            Seconds: 21
    > contract address:    0xF2e9ddb1bb8de65d0C949a580977eFE65819b68d
    > block number:        11571324
    > block timestamp:     1638889554
    > account:             0xABFf604B340Da8612F07b0d76ef54b2d2A8B611b
    > balance:             0.280695032993706428
    > gas used:            1373260 (0x14f44c)
    > gas price:           1.500000008 gwei
    > value sent:          0 ETH
    > total cost:          0.00205989001098608 ETH

    Pausing for 2 confirmations...
    ------------------------------
    > confirmation number: 1 (block: 11571325)
    > confirmation number: 2 (block: 11571326)
    0xF2e9ddb1bb8de65d0C949a580977eFE65819b68d

    Deploying 'BankLoan'
    --------------------
    > transaction hash:    0x63369f4cdccf8ff98983c7ba811339920258ade9f231b70aec9c1daebe344e41
    > Blocks: 1            Seconds: 9
    > contract address:    0xE11cC3C3819E7d6EFa1eb55638EEb55f6B1FdDCd
    > block number:        11571327
    > block timestamp:     1638889591
    > account:             0xABFf604B340Da8612F07b0d76ef54b2d2A8B611b
    > balance:             0.276593182471829892
    > gas used:            2734567 (0x29b9e7)
    > gas price:           1.500000008 gwei
    > value sent:          0 ETH
    > total cost:          0.004101850521876536 ETH

    Pausing for 2 confirmations...
    ------------------------------
    > confirmation number: 1 (block: 11571328)
    > confirmation number: 2 (block: 11571329)

    > Saving migration to chain.
    > Saving artifacts
    -------------------------------------
    > Total cost:     0.006161740532862616 ETH


    Summary
    =======
    > Total deployments:   4
    > Final cost:          0.007576470042045942 ETH

Step 5 - Check availability
~~~~~~~~~~~~~~~~~~~~~~~~~~~

That’s it! Our contract instances will be stored in the testnet, and publicly accessible to anyone.

You can see your contract on a block explorer such as `Etherscan <https://etherscan.io/>`_. 
Remember to access the explorer on the testnet where you deployed your contract, such as `ropsten.etherscan.io <https://ropsten.etherscan.io/>`_ for Ropsten.

TIP: You can check out the contract we deployed in the example above, along with all transactions sent to it, `here <https://ropsten.etherscan.io/address/0xABFf604B340Da8612F07b0d76ef54b2d2A8B611b>`_.

You can also interact with your instance as you regularly would, either using truffle console, or programmatically using web3. ::

    $ truffle console --network ropsten
    truffle(ropsten)> micro = await MicroToken.deployed()
    truffle(ropsten)> (await micro.totalSupply()).toString()

Step 6 - Refer to Smart Contracts addreses in Ropsten network
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This deployment information will record in the build files inside ``build\contracts\`` directory

Ex: ``MicroToken.json`` ::

    "networks": {
        "3": {
        "events": {},
        "links": {},
        "address": "0x17c591C75978E90786E581c683Bf596D94199db7",
        "transactionHash": "0x082fd2bce39eb95178ab78588252c71a2d3d01eba4840264aa556b18ea275f3e"
        },
        "5777": {
        "events": {},
        "links": {},
        "address": "0xe0F3B6602962630d182EC424FbfBAd24119988da",
        "transactionHash": "0x3f3d7ca9cf5be97e2899118d48e7c0e299ea5e5ea8800d8298a43f4b1b7c7114"
        }
    },

All React web applications configured to ``5777`` local blockchain. 
Now we are going to change the network to Ropsten and refer to the smart contract addresses in the Ropsten network.

1. Refer ``bank-web-application`` to Ropsten
open ``bank-web-app/stores/smartContractContext.js`` navigate to ``Smart Contract Addresses``
change the ``5777`` value to ``3``. ::

    // Smart Contract Addresses
    const microTokenAddress = MicroTokenArtifact.networks[3].address;
    const userIdentityAddress = UserIdentityArtifact.networks[3].address;
    const bankLoanAddress = BankLoanArtifact.networks[3].address;

This will refer the smart contract adderesses of Ropsten network used in ``bank-web-app``

You may need more fake ETHERS to other accounts (Wallet accounts for Broker and Borrower users) in MetaMask to use the system.

