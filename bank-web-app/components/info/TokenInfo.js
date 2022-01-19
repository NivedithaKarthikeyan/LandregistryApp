import React, { useEffect, useState, useContext } from 'react';
import { Card, Table, message } from 'antd';
import AuthContext from '../../stores/authContext';

function TokenInfo() {
	const [totalSupply, setTotalSupply] = useState('0.00');
	const [decimals, setDecimals] = useState('0.00');
	const { MicroToken } = useContext(AuthContext);

	console.log(MicroToken);

	const getTotalSupply = async () => {
		try {
			const accounts = await window.ethereum.enable();
			console.log(accounts[0]);
			const response = await MicroToken.methods.totalSupply().call();

			setTotalSupply(response);
		} catch (err) {
			console.log(err);
			message.error('Error occured while reading totalSupply');
		}
	};

	const getDecimals = async () => {
		try {
			const accounts = await window.ethereum.enable();
			console.log(accounts[0]);
			const response = await MicroToken.methods.decimals().call();

			setDecimals(response);
		} catch (err) {
			console.log(err);
			message.error('Error occured while reading decimals');
		}
	};

	useEffect(() => {
		getTotalSupply();
		getDecimals();
	}, []);

	const columns = [
		{ title: 'Attribute', dataIndex: 'attribute', key: 'attribute', width: '20%' },
		{ title: 'Description', dataIndex: 'description', key: 'description' },
	];

	const data = [
		{
			attribute: 'Contract address',
			description: MicroToken._address,
		},
		{
			attribute: 'Total supply',
			description: totalSupply,
		},
		{
			attribute: 'Decimals',
			description: decimals,
		},
	];

	return (
		<Card title="Microfinance Tokens informations">
			<Table columns={columns} dataSource={data} pagination={false} size="small" columnWidth="30%" />
		</Card>
	);
}

export default TokenInfo;
