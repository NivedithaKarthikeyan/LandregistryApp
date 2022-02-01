import React, { createContext, useState } from 'react';

import Web3 from 'web3';
import MicroTokenArtifact from '../../blockchain/build/contracts/MicroToken.json';
import BankLoanArtifact from '../../blockchain/build/contracts/BankLoan.json';
import UserIdentityArtifact from '../../blockchain/build/contracts/UserIdentity.json';

const AuthContext = createContext({
	user: null,
	userRole: null,
	login: () => {},
});

export const AuthContextProvider = ({ children }) => {
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
	];

	const [user, setUser] = useState(users[1]);

	const login = (role) => {
		if (role === 'broker') {
			setUser(users[0]);
		} else if (role === 'bank') {
			setUser(users[1]);
		} else if (role === 'borrower') {
			setUser(users[2]);
		}
	};
	const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

	// Smart Contract Addresses
	const microTokenAddress = MicroTokenArtifact.networks[5777].address;
	const userIdentityAddress = UserIdentityArtifact.networks[5777].address;
	const bankLoanAddress = BankLoanArtifact.networks[5777].address;

	const UserIdentityContract = new web3.eth.Contract(UserIdentityArtifact.abi, userIdentityAddress);
	const MicroTokenContract = new web3.eth.Contract(MicroTokenArtifact.abi, microTokenAddress);
	const BankLoanContract = new web3.eth.Contract(BankLoanArtifact.abi, bankLoanAddress);

	const context = { user, login, web3, MicroTokenContract, UserIdentityContract, BankLoanContract };

	return (
		<AuthContext.Provider value={context}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
