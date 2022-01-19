import React, { useContext, useEffect } from 'react';
import 'antd/dist/antd.css';
import { useRouter } from 'next/router';

import { Layout, Row, Col, Typography, Avatar, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import styles from './BasicLayout.module.css';
import BrokerMenu from './menu/BrokerMenu';
import BankMenu from './menu/BankMenu';
import AuthContext from '../stores/authContext';
import BorrowerMenu from './menu/BorrowerMenu';

function BasicLayout({ children }) {
	const { Title } = Typography;
	const { Option } = Select;

	const { user, login } = useContext(AuthContext);

	const router = useRouter();

	const { Header, Sider } = Layout;

	useEffect(() => {
		if (user.role === 'broker') {
			router.push('/public/transfer');
		} else if (user.role === 'bank') {
			router.push('/bank/loans');
		} else if (user.role === 'borrower') {
			router.push('/borrower/transfer');
		}
	}, [user]);

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header className="header" style={{ backgroundColor: 'purple' }}>
				<Row>
					<Col span={24}>
						<div className="logo" style={{ float: 'left', marginTop: 10 }}>
							<Title level={2} style={{ color: 'white', margin: 'auto' }}>Microfinance - Bank UI</Title>
						</div>
						<Select
							size="large"
							defaultValue="broker"
							style={{ width: 110, backgroundColor: 'black', float: 'right', marginTop: 13, marginLeft: 10 }}
							onChange={login}
						>
							<Option value="broker">Broker</Option>
							<Option value="bank">Bank</Option>
							<Option value="borrower">Borrower</Option>
						</Select>

						<div className={styles.profile} style={{ float: 'right' }}>
							<Avatar style={{ backgroundColor: user.color, margin: 'auto' }} icon={<UserOutlined />} />
							<span style={{ color: 'white', margin: '0px 10px', fontSize: 25 }}>{user.name}</span>
						</div>
					</Col>
				</Row>
			</Header>
			<Layout>
				<Sider width={200} className="site-layout-background">
					{user.role === 'broker' && <BrokerMenu /> }
					{user.role === 'bank' && <BankMenu /> }
					{user.role === 'borrower' && <BorrowerMenu /> }
				</Sider>
				<Layout style={{ padding: '16px' }}>
					{children}
				</Layout>
			</Layout>
		</Layout>
	);
}

export default BasicLayout;
