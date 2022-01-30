import React, { useState } from 'react';
import { Form, Input, Button, InputNumber } from 'antd';

function TransferForm({ setAddress, setAmount }) {
	const [componentSize] = useState('default');

	const onFinish = async (values) => {
		setAddress(values.address);
		setAmount(values.amount);
	};

	return (
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
			size={componentSize}
			labelAlign="left"
			onFinish={onFinish}
		>
			<Form.Item label="Receiver" name="address" rules={[{ required: true, message: 'Please input receiver address!' }]}>
				<Input
					placeholder="Enter receiver address"
				/>
			</Form.Item>
			<Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please input token amount!' }]}>
				<InputNumber
					min="0"
					style={{ width: '100%' }}
					placeholder="Enter amount"
				/>
			</Form.Item>
			<Form.Item wrapperCol={{
				lg: { span: 14, offset: 3 },
				xl: { span: 14, offset: 2 },
				xxl: { span: 14, offset: 2 } }}
			>
				<Button type="primary" htmlType="submit">Transfer tokens</Button>
			</Form.Item>
		</Form>

	);
}

export default TransferForm;
