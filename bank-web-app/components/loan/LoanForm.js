import React, { useState, useContext } from 'react';
import { Card, Form, InputNumber, Input, Button, message } from 'antd';
import AuthContext from '../../stores/authContext';

function LoanForm() {
	const [componentSize, setComponentSize] = useState('default');

	const { BankLoan } = useContext(AuthContext);

	const onFormLayoutChange = ({ size }) => {
		setComponentSize(size);
	};

	const createLoanRequest = async (values) => {
		try {
			const accounts = await window.ethereum.enable();
			console.log(values);

			await BankLoan.methods.applyLoan(
				values.amount,
				values.period,
				values.interest,
				values.planId,
				values.borrower,
				values.brokerFee,
			).send({ from: accounts[0] });
			// console.log(response)
			message.success('New loan requested successfully');
		} catch (err) {
			message.error('Error creating loan request');
			console.log(err);
		}
	};

	return (

		<Card title="Loan Request">
			<Form
				labelCol={{
					lg: 3,
					xl: 2,
					xxl: 2,
				}}
				wrapperCol={{
					lg: 14,
					xl: 12,
					xxl: 10,
				}}
				layout="horizontal"
				initialValues={{
					size: componentSize,
				}}
				onValuesChange={onFormLayoutChange}
				size={componentSize}
				labelAlign="left"
				onFinish={createLoanRequest}
			>
				<Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter amount!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter amount"
					/>
				</Form.Item>
				<Form.Item label="Period" name="period" rules={[{ required: true, message: 'Please enter period!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter loan period"
					/>
				</Form.Item>
				<Form.Item label="Interest" name="interest" rules={[{ required: true, message: 'Please enter interest!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter interest rate"
					/>
				</Form.Item>
				<Form.Item label="Plan ID" name="planId" rules={[{ required: true, message: 'Please enter plan id!' }]}>
					<Input
						placeholder="Enter plan id"
					/>
				</Form.Item>
				<Form.Item label="Borrower" name="borrower" rules={[{ required: true, message: 'Please enter borrower!' }]}>
					<Input
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter plan id"
					/>
				</Form.Item>
				<Form.Item label="Broker Fee" name="brokerFee" rules={[{ required: true, message: 'Please enter Broker Fee!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter broker fee"
					/>
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 3 },
					xl: { span: 14, offset: 2 },
					xxl: { span: 14, offset: 2 } }}
				>
					<Button type="primary" htmlType="submit">Request loan</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default LoanForm;
