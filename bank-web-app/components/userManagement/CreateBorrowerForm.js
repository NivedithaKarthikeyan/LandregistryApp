import React, { useState, useContext } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import AuthContext from '../../stores/authContext';

function CreateBorrowerForm() {
	const [componentSize, setComponentSize] = useState('default');
	const [form] = Form.useForm();

	const { UserIdentityContract } = useContext(AuthContext);

	const onFormLayoutChange = ({ size }) => {
		setComponentSize(size);
	};

	const createBorrower = async (values) => {
		try {
			const accounts = await window.ethereum.enable();
			await UserIdentityContract.methods.addBorrower(values.socialId, values.address, values.name).send({ from: accounts[0] });
			message.success('Borrower is registered successfully!');
		} catch (err) {
			message.error('Error occured while registering Borrower!');
			console.log(err);
		}
	};

	return (

		<Card title="Borrower Application">
			<Form
				form={form}
				labelCol={{
					lg: 4,
					xl: 3,
					xxl: 2,
				}}
				wrapperCol={{
					lg: 16,
					xl: 14,
					xxl: 10,
				}}
				layout="horizontal"
				initialValues={{
					size: componentSize,
				}}
				onValuesChange={onFormLayoutChange}
				size={componentSize}
				labelAlign="left"
				onFinish={createBorrower}
			>
				<Form.Item label="Id Number" name="socialId" rules={[{ required: true, message: 'Please input Borrower\'s social security id!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter social security number"
					/>
				</Form.Item>
				<Form.Item label="Borrower Name" name="name" rules={[{ required: true, message: 'Please input Borrower\'s name!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter borrower's name"
					/>
				</Form.Item>
				<Form.Item label="Wallet Address" name="address" rules={[{ required: true, message: 'Please input Borrower\'s address!' }]}>
					<Input
						style={{ width: '100%' }}
						placeholder="Enter borrower's wallet address"
					/>
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 4 },
					xl: { span: 14, offset: 3 },
					xxl: { span: 14, offset: 2 } }}
				>
					<Button type="primary" htmlType="submit">Register Borrower</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default CreateBorrowerForm;
