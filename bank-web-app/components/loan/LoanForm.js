import React, { useContext } from 'react';
import { Card, Form, InputNumber, Input, Button, message } from 'antd';
import SmartContractContext from '../../stores/smartContractContext';

function LoanForm() {
	const { BankLoanContract } = useContext(SmartContractContext); // Get the Bank Loan Contract instance defined in the 'stores/smartContractContext.js'

	// Create loan request
	// Values parameter contains the field values submitted through the form.
	const createLoanRequest = async (values) => {
		try {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); // Get the selected account from the metamask plugin.
			console.log(accounts);
			// Call applyLoan method of the Bank Loan Contract.
			// Following parameters can be captured using their name property on the form item.
			// Parameters:
			// 		amount - loan amount
			//		period - loan duration
			//		interest - loan interest
			//		planId - loan plan id
			//		borrower - borrower of the loan
			//		brokerFee - broker fee of the loan
			await BankLoanContract.methods.applyLoan(
				values.amount,
				values.period,
				values.interest,
				values.planId,
				values.borrower,
				values.brokerFee,
			).send({ from: accounts[0] }); // Meta mask will return the selected account as an array. This array contains only one account address.
			message.success('New loan requested successfully');
		} catch (err) {
			console.log(err);
			message.error('Error creating loan request');
		}
	};

	return (
		<Card title="Loan Request Form">
			<Form
				labelCol={{ lg: 3, xl: 2, xxl: 3 }}
				wrapperCol={{ lg: 14, xl: 12, xxl: 10 }}
				layout="horizontal"
				size="default"
				labelAlign="left"
				onFinish={createLoanRequest} // createLoanRequest function will execute when user submit the loan form.
			>
				{/* Name property value(amount) will use to capture the Input field value when submit the form */}
				<Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter amount!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter loan amount"
					/>
				</Form.Item>
				<Form.Item label="Period" name="period" rules={[{ required: true, message: 'Please enter loan period!' }]}>
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
				<Form.Item label="Borrower Address" name="borrower" rules={[{ required: true, message: 'Please enter Borrower\' wallet address!' }]}>
					<Input
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter Borrower's address"
					/>
				</Form.Item>
				<Form.Item label="Broker Fee" name="brokerFee" rules={[{ required: true, message: 'Please enter Broker Fee!' }]}>
					<InputNumber
						min="0"
						style={{ width: '100%' }}
						placeholder="Enter Broker fee"
					/>
				</Form.Item>
				<Form.Item wrapperCol={{
					lg: { span: 14, offset: 3 },
					xl: { span: 14, offset: 2 },
					xxl: { span: 14, offset: 3 } }}
				>
					{/* Form submit button */}
					<Button type="primary" htmlType="submit">Request Loan</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default LoanForm;
