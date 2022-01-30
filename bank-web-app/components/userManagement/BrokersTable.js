import React, { useState, useContext, useEffect } from 'react';
import { Table, Card, message } from 'antd';
import AuthContext from '../../stores/authContext';

function BrokersTable() {
	const { UserIdentityContract } = useContext(AuthContext);

	const [data, setData] = useState([]);

	const getBrokers = async () => {
		try {
			const response = await UserIdentityContract.methods.getAllBrokers().call();

			setData([]);

			for (let i = 0; i < response.length; i++) {
				const row = {
					key: response[i].id,
					id: response[i].id,
					socialId: response[i].socialSecurityId,
					address: response[i].userAddress,
					name: response[i].name,
					status: response[i].state,
				};

				setData((prev) => {
					return [...prev, row];
				});
			}
			// console.log(response);
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
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
		},
	];

	useEffect(() => {
		getBrokers();
	}, []);

	return (
		<>
			<Card title="Brokers">
				<Table pagination="true" columns={columns} dataSource={data} />
			</Card>
		</>
	);
}

export default BrokersTable;
