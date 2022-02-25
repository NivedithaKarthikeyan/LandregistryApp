Smart Contract Context
======================

``SmartContractContext`` provides the smart contract instances and ``web3`` instance.

Import Dependencies
-------------------

list of dependencies of userContext. ::

	import React, { createContext } from 'react';
	import Web3 from 'web3';
	import MicroTokenArtifact from '../../blockchain/build/contracts/MicroToken.json';
	import BankLoanArtifact from '../../blockchain/build/contracts/BankLoan.json';
	import UserIdentityArtifact from '../../blockchain/build/contracts/UserIdentity.json';

First we import React and its ``createContext`` hook.
Next we import Web3 to interact with Ethereum blockchain smart contracts.

Then we import 3 smart contract json files. These were directly import from ``blockchain/build/contracts`` directory for simplicity.
Any changes will be made in the smart contracts will reflect in the app as well.

Web3 Provider
-------------

The following code line will setup initialize the web3. ::

    const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

If this application run on a Ethereum compatible browser then  it will set with the current native provider by that browser.
It will return the given provider by the (browser) environment. We already config the MetaMask in our browser.
If not it will connects to `http://127.0.0.1:7545` (Ganache). 

Smart Contract Addresses
------------------------

The following code snippet config the smart contract addresses. ::

	// Smart Contract Addresses
	const microTokenAddress = MicroTokenArtifact.networks[5777].address;
	const userIdentityAddress = UserIdentityArtifact.networks[5777].address;
	const bankLoanAddress = BankLoanArtifact.networks[5777].address;

We refer to all the ``.json`` imports of the smart contracts and refere their network configurations.
``5777`` is Ganache blockchain id. 
When we use the Ganache local blockchain we use network ``5777``.

It will create a network object for each network we deploy our contracts.
If we didn't deploy the smart contracts then network object will empty and there will be an error.

Smart Contract Objects
----------------------

Next target is to create contract objects for our smart contracts within the application to ineract with them. ::

	const UserIdentityContract = new web3.eth.Contract(UserIdentityArtifact.abi, userIdentityAddress);
	const MicroTokenContract = new web3.eth.Contract(MicroTokenArtifact.abi, microTokenAddress);
	const BankLoanContract = new web3.eth.Contract(BankLoanArtifact.abi, bankLoanAddress);

we can use ``web3.eth.Contract(..)`` method to create contract intances and we pass contract abi and its address.
We use the above smart contract imports and pass their ``abi`` and smart contract addresses we capture in previos code snippet.

Finally we create a ``context`` with all the objects we defined which is usefull throughout the application. ::

	const context = { MicroTokenContract, UserIdentityContract, BankLoanContract };

We return SmartContractContext as follows. ::

    return (
		<SmartContractContext.Provider value={context}>
			{children}
		</SmartContractContext.Provider>
	);

Complete smartContractContext Script
------------------------------------

Complete ``userContext`` script. ::

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

