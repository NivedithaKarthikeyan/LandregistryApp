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
			<Header className="header" style={{ backgroundColor: 'purple', maxHeight: 50 }}>
				<Row>
					<Col span={17}>
						<div className="logo" style={{ float: 'left', marginTop: '20' }}>
							<Title level={4} style={{ color: 'white', marginTop: 10 }}>Microfinance - Bank UI</Title>
						</div>
					</Col>
					<Col span={4}>
						<div className={styles.profile} style={{ maxHeight: 45, float: 'right' }}>
							<Avatar style={{ backgroundColor: user.color }} size="small" icon={<UserOutlined />} />
							<span style={{ color: 'white', margin: '0px 10px', fontSize: 20 }}>{user.name}</span>
						</div>
					</Col>
					<Col span={3}>
						<Select
							size="small"
							defaultValue="broker"
							style={{ width: 110, backgroundColor: 'black', float: 'left', marginTop: 12, marginLeft: 10 }}
							onChange={login}
						>
							<Option value="broker">Broker</Option>
							<Option value="bank">Bank</Option>
							<Option value="borrower">Borrower</Option>
						</Select>
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
