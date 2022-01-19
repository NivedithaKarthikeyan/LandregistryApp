import React from 'react';
import { Row, Col } from 'antd';
import CreateBorrowerForm from '../../components/userManagement/CreateBorrowerForm';

function RegisterBorrower() {
	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<CreateBorrowerForm />
				</Col>
			</Row>
		</>
	);
}

export default RegisterBorrower;
