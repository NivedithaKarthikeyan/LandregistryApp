import React, { useState } from 'react';
import { Form, Button, Space } from 'antd';
import { formatCountdown } from 'antd/lib/statistic/utils';

// Token transfer confirmation functional component.
// addressn state, amount state, confirmTokenTransfer function and prev state pass a properties.
function TransactionConfirm({ address, amount, confirmTokenTransfer, prev }) {
	const [componentSize] = useState('default');

	return (
		// Form displays the receiver address and the token amount in the form.
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
		>
			<Form.Item label="Receiver">
				<span> { address } </span>
			</Form.Item>
			<Form.Item label="Amount">
				<span> { amount } </span>
			</Form.Item>
			<Form.Item wrapperCol={{
				lg: { span: 14, offset: 3 },
				xl: { span: 14, offset: 2 },
				xxl: { span: 14, offset: 2 } }}
			>
				<Space direction="horizontal">
					<Button type="primary" onClick={(e) => confirmTokenTransfer(e)}>Confirm transfer</Button>
					<Button onClick={(e) => prev(e)}>Back</Button>
				</Space>
			</Form.Item>
		</Form>

	);
}

export default TransactionConfirm;
