AuthContext
===========

``authContext`` is providing all the user, blockchain and IPFS configurations.
This follows the React Context concepts. Find more about `Context <https://reactjs.org/docs/context.html>`_.

imports
-------

list of dependencies of authContext. ::

    import React, { createContext, useState } from 'react';

    import Web3 from 'web3';
    import MicroTokenArtifact from '../../blockchain/build/contracts/MicroToken.json';
    import BankLoanArtifact from '../../blockchain/build/contracts/BankLoan.json';
    import UserIdentityArtifact from '../../blockchain/build/contracts/UserIdentity.json';

First we import React and its createContext and useState modules.
Next we import Web3 to connect app with Ethereum blockchain smart contracts and ipfs-api to interact with IPFS.

Then we import 4 smart contract json files. These were directly import from ``blockchain/build/contracts`` directory for simplicity.
Any changes will be made in the smart contracts will reflect in the app as well. 

Web3 Provider
-------------

The following code line will setup initialize the web3. ::

    const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

If this application run on a Ethereum compatible browser then  it will set with the current native provider by that browser.
It will return the given provider by the (browser) environment. We already config the MetaMask in our broswer.
If not it will connects to `http://127.0.0.1:7545` (Ganache). 

Contract Addresses
------------------

The following code snippet config the smart contract addresses. ::

	// Smart Contract Addresses
	const microTokenAddress = MicroTokenBuild.networks[5777].address;
	const userIdentityAddress = UserIdentityBuild.networks[5777].address;
	const bankLoanAddress = BankLoanBuild.networks[5777].address;
	const loanPaymentAddress = LoanPaymentBuild.networks[5777].address;

We refer to all the ``.json`` imports of the smart contracts and refere their network configurations.
``5777`` is Ganache blockchain id. 
When we use the Ganache local blockchain we use network ``5777`` and if it is Ropsten we use ``3``
Ropsten is refer to network id ``3``.

It will create a network object for each network we deploy our contracts.
If we didn't deploy the smart contracts then network object will empty and there will be an error.

Contract object
---------------

Next target is to create contract objects for our smart contracts within the application to ineract with them. ::

	const UserIdentityContract = new web3.eth.Contract(UserIdentityBuild.abi, userIdentityAddress);
	const MicroTokenContract = new web3.eth.Contract(MicroTokenBuild.abi, microTokenAddress);
	const BankLoanContract = new web3.eth.Contract(BankLoanBuild.abi, bankLoanAddress);
	const LoanPaymentContract = new web3.eth.Contract(LoanPaymentBuild.abi, loanPaymentAddress);

we can use ``web3.eth.Contract(..)`` method to create contract intances and we pass contract abi and its address.
We use the above smart contract imports and pass their ``abi`` and smart contract addresses we capture in previos code snippet.

Finally we create a ``context`` with all the objects we defined which is usefull through out the application. ::

	const context = { user, login, web3, MicroToken, UserIdentity, BankLoan };

We return AuthContext as follows. ::

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    );