Smart Contract Context
======================

``SmartContractContext`` enables the system to connect to smart contract instances and the ``web3`` instance.

Import Dependencies
-------------------

Dependencies of userContractContext. ::

	import React, { createContext } from 'react';
	import Web3 from 'web3';
	import MicroTokenArtifact from '../../blockchain/build/contracts/MicroToken.json';
	import BankLoanArtifact from '../../blockchain/build/contracts/BankLoan.json';
	import UserIdentityArtifact from '../../blockchain/build/contracts/UserIdentity.json';

We import React and its ``createContext`` hook.
We import Web3 to allow the system to interact with Ethereum blockchain smart contracts.

Then we import 3 smart contract json files. These were directly imported from the ``blockchain/build/contracts`` directory for simplicity.
Any changes made to the smart contracts will be reflected in the app.

Web3 Provider
-------------

The following code line initializes web3. ::

    const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

If this application runs on an Ethereum compatible browser, it will be set as the current native provider by the browser.
It returns the current given provider of the (browser) environment, assuming MetaMask has been configured in the browser.
Otherwise, it will connect to the local blockchain at `http://127.0.0.1:7545` (Ganache). 

Smart Contract Address
------------------------

The following code configures the three smart contract addresses. ::

	// Smart Contract Addresses
	const microTokenAddress = MicroTokenArtifact.networks[5777].address;
	const userIdentityAddress = UserIdentityArtifact.networks[5777].address;
	const bankLoanAddress = BankLoanArtifact.networks[5777].address;

We refer to all the ``.json`` imports of the smart contracts and refer to their network configurations.
``5777`` is the Ganache blockchain id. 
When we use Ganache local blockchain, we use network ``5777``.

This creates a network object for each network that we deployed our contracts.
If we didn't deploy any smart contract, the network object is empty and this results in error.

Smart Contract Objects
----------------------

We need to create contract objects for smart contracts within the application to order to interact with them. ::

	const UserIdentityContract = new web3.eth.Contract(UserIdentityArtifact.abi, userIdentityAddress);
	const MicroTokenContract = new web3.eth.Contract(MicroTokenArtifact.abi, microTokenAddress);
	const BankLoanContract = new web3.eth.Contract(BankLoanArtifact.abi, bankLoanAddress);

We use the ``web3.eth.Contract(..)`` method to create contract intances and we pass contract ABI and its address.
We use the above smart contract imports and pass their ``abi`` and smart contract addresses we captured in the previous code snippet.

Finally, we create a ``context`` with all the objects we defined for use throughout the application. ::

	const context = { MicroTokenContract, UserIdentityContract, BankLoanContract };

We return SmartContractContext as follows. ::

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

