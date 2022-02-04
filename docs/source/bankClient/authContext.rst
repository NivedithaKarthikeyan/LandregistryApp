UserContext
===========

``userContext`` is providing user details.
It stores the current user and function to change the user.
This follows the React Context concepts. Find more about `Context <https://reactjs.org/docs/context.html>`_.


first it imports following dependencies. ::

    import React, { createContext, useState } from 'react';

userContext uses the createContext and useState hooks.

Then define the UserContext with the default values as follows. ::

    const UserContext = createContext({
        user: null,
        login: () => {},
    });

Then we define the UserContextProvider function as follows. ::

    export const UserContextProvider = ({ children }) => {
        const users = [
            {
                name: 'Leonard Hofstadter',
                role: 'broker',
                color: '#87d068',
            },
            {
                name: 'Sheldon Cooper',
                role: 'bank',
                color: '#8193E7',
            },
            {
                name: 'Rajesh Koothrapali',
                role: 'borrower',
                color: '#8193E7',
            },
            {
                name: 'Guest',
                role: 'public',
                color: '#8193E7',
            },
        ];

        const [user, setUser] = useState(users[1]);

        const login = (role) => {
            if (role === 'broker') {
                setUser(users[0]);
            } else if (role === 'bank') {
                setUser(users[1]);
            } else if (role === 'borrower') {
                setUser(users[2]);
            } else if (role === 'public') {
                setUser(users[3]);
            }
        };

        const context = { user, login };

        return (
            <UserContext.Provider value={context}>
                {children}
            </UserContext.Provider>
        );
    };

    export default UserContext;

Since we do not define any login facility, we use dummy user data in the Bank Web Application.
First it defines the users array. It contains users from each role for testing purposes only.
Next, it sets the ``user`` state.
This user will be the first user loaded in the Bank Web App when it loads.
Then it defines the login function to facilitate the user role change within the Bank Web App.
These ``user`` state and ``login`` function will set as the context value. 
These values can be accessed by components in the DOM later.

SmartContractContext
====================

``SmartContractContext`` provides the smart contract instances and ``web3`` instance.

imports
-------

list of dependencies of userContext. ::

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

We refer to all the ``.json`` imports of the smart contracts and refere their network configurations.
``5777`` is Ganache blockchain id. 
When we use the Ganache local blockchain we use network ``5777``.

It will create a network object for each network we deploy our contracts.
If we didn't deploy the smart contracts then network object will empty and there will be an error.

Contract object
---------------

Next target is to create contract objects for our smart contracts within the application to ineract with them. ::

	const UserIdentityContract = new web3.eth.Contract(UserIdentityBuild.abi, userIdentityAddress);
	const MicroTokenContract = new web3.eth.Contract(MicroTokenBuild.abi, microTokenAddress);
	const BankLoanContract = new web3.eth.Contract(BankLoanBuild.abi, bankLoanAddress);

we can use ``web3.eth.Contract(..)`` method to create contract intances and we pass contract abi and its address.
We use the above smart contract imports and pass their ``abi`` and smart contract addresses we capture in previos code snippet.

Finally we create a ``context`` with all the objects we defined which is usefull through out the application. ::

	const context = { MicroTokenContract, UserIdentityContract, BankLoanContract };

We return SmartContractContext as follows. ::

    return (
        <SmartContractContext.Provider value={context}>
            {children}
        </SmartContractContext.Provider>
    );