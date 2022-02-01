import React from 'react';
import { Button, Result } from 'antd';

// React functional component to display transaction fail status.
// backToHome function pass as a property.
function TransactionFail({ backToHome }) {
	return (
		<Result
			status="error"
			title="Transaction failed!"
			extra={[
				<Button type="primary" key="home" onClick={(e) => backToHome(e)}>
					Go back
				</Button>,
			]}
		/>

	);
}

export default TransactionFail;
