Smart Contract Context
======================

``SmartContractContext`` enables the system to connect to deployed smart contract instances.  It also defines a ``web3`` instance for interaction with a running blockchain.

Import Dependencies
-------------------

Dependencies of userContractContext: ::

	import React, { createContext } from 'react';
	import Web3 from 'web3';
	import MicroTokenArtifact from '../../blockchain/build/contracts/MicroToken.json';
	import BankLoanArtifact from '../../blockchain/build/contracts/BankLoan.json';
	import UserIdentityArtifact from '../../blockchain/build/contracts/UserIdentity.json';

We import React and its ``createContext`` hook.
We import Web3 to allow the system to interact with Ethereum blockchain smart contracts.

Then we import 3 smart contract json files from the ``blockchain/build/contracts`` directory into objects, to be used below.
Each json file contains the latest information (e.g., ABI) of the corresponding compiled smart contract.  Any changes made to the smart contract is reflected in the json file, and once imported, made available to the web app to use.

Web3 Provider
-------------

The following code line initializes the ``web3`` instance from one of two sources: ::

    const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

If the web application runs on an Ethereum compatible browser, the current given provider of the (browser) environment is used, assuming MetaMask has been configured in the browser.
Otherwise, ``web3`` connects to the local blockchain running at `http://127.0.0.1:7545` (Ganache). 

Smart Contract Address
------------------------

The following code obtains three smart contract addresses and assigns them to objects for use: ::

	// Smart Contract Addresses
	const microTokenAddress = MicroTokenArtifact.networks[5777].address;
	const userIdentityAddress = UserIdentityArtifact.networks[5777].address;
	const bankLoanAddress = BankLoanArtifact.networks[5777].address;

Using the artifact objects initialized earlier, we refer to to the network configurations where
``5777`` is the Ganache blockchain id. 
When we use Ganache local blockchain, we use network ``5777``.

This creates a network object for the system to refer to the deployed smart contract instances, to be used below.
If we didn't deploy any smart contract, the network object is empty and this results in error.

Smart Contract Objects
----------------------

We need to create contract objects for smart contracts within the application to order to interact with them. ::

	const UserIdentityContract = new web3.eth.Contract(UserIdentityArtifact.abi, userIdentityAddress);
	const MicroTokenContract = new web3.eth.Contract(MicroTokenArtifact.abi, microTokenAddress);
	const BankLoanContract = new web3.eth.Contract(BankLoanArtifact.abi, bankLoanAddress);

We use the ``web3.eth.Contract(..)`` method to create contract intances and we pass contract ABI and its address.
As you can see, we are have ``abi`` and address of the deployed smart contract instance, the two key information to interact with the smart contracts in the blockchain.

Finally, we create a ``context`` with all the objects for use throughout the application. ::

	const context = { MicroTokenContract, UserIdentityContract, BankLoanContract };

We return SmartContractContext as the output of the smart contract provider: ::

    return (
		<SmartContractContext.Provider value={context}>
			{children}
		</SmartContractContext.Provider>
	);

Complete smartContractContext Script
------------------------------------

::

	import React, { createContext } from 'react';
	import Web3 from 'web3';
	import MicroTokenArtifact from '../../blockchain/build/contracts/MicroToken.json';
	import BankLoanArtifact from '../../blockchain/build/contracts/BankLoan.json';
	import UserIdentityArtifact from '../../blockchain/build/contracts/UserIdentity.json';

	// Create context and set default values.
	const SmartContractContext = createContext({});

	export const SmartContractContextProvider = ({ children }) => {
		const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

		// Smart Contract Addresses
		const microTokenAddress = MicroTokenArtifact.networks[5777].address;
		const userIdentityAddress = UserIdentityArtifact.networks[5777].address;
		const bankLoanAddress = BankLoanArtifact.networks[5777].address;

		const UserIdentityContract = new web3.eth.Contract(UserIdentityArtifact.abi, userIdentityAddress);
		const MicroTokenContract = new web3.eth.Contract(MicroTokenArtifact.abi, microTokenAddress);
		const BankLoanContract = new web3.eth.Contract(BankLoanArtifact.abi, bankLoanAddress);

		const context = { MicroTokenContract, UserIdentityContract, BankLoanContract };

		return (
			<SmartContractContext.Provider value={context}>
				{children}
			</SmartContractContext.Provider>
		);
	};

	export default SmartContractContext;

