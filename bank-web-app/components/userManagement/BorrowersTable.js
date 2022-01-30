import React, { useState, useContext, useEffect } from 'react';
import { Table, Card, message } from 'antd';
import AuthContext from '../../stores/authContext';

function BorrowersTable() {
	const { UserIdentityContract } = useContext(AuthContext);
	const [data, setData] = useState([]);
	const brokers = {};

	const getBrokers = async () => {
		const response = await UserIdentityContract.methods.getAllBrokers().call();
		for (let i = 0; i < response.length; i++) {
			brokers[response[i].userAddress] = response[i].name;
		}
	};

	const getBorrowers = async () => {
		try {
			const response = await UserIdentityContract.methods.getAllBorrowers().call();

			setData([]);

			for (let i = 0; i < response.length; i++) {
				const row = {
					key: response[i].id,
					id: response[i].id,
					socialId: response[i].socialSecurityId,
					address: response[i].userAddress,
					name: response[i].name,
				};

				setData((prev) => {
					return [...prev, row];
				});
			}
		} catch (err) {
			console.log(err);
			message.error('Error occured while loading brokers');
		}
	};

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			render: text => text,
		},
		{
			title: 'Social Id',
			dataIndex: 'socialId',
			key: 'socialId',
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Wallet Address',
			dataIndex: 'address',
			key: 'address',
		},
	];

	useEffect(() => {
		getBrokers();
		getBorrowers();
	}, []);

	return (
		<>
			<Card title="Borrowers">
				<Table pagination="true" columns={columns} dataSource={data} />
			</Card>
		</>
	);
}

export default BorrowersTable;
