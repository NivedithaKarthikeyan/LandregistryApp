import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

import { useRouter } from 'next/router';

function BankMenu() {
	const router = useRouter();
	const { SubMenu } = Menu;

	return (
		<Menu
			mode="inline"
			defaultSelectedKeys={['/register-broker']}
			defaultOpenKeys={['register']}
			style={{ height: '100%', borderRight: 0 }}
		>
			<SubMenu key="register" title="Register as">
				<Menu.Item key="/register-broker" onClick={() => router.push('/public/register-broker')}>Broker</Menu.Item>
				<Menu.Item key="/register-insurance" onClick={() => router.push('/public/register-insurance')}>Insurance Co.</Menu.Item>
			</SubMenu>
			<Menu.Item key="/blockchain" onClick={() => router.push('/public/blockchain')}>
				Blockchain
			</Menu.Item>
			<Menu.Item key="/info" onClick={() => router.push('/public/info')}>
				Info
			</Menu.Item>
		</Menu>
	);
}

export default BankMenu;
