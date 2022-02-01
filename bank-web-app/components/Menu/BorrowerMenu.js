import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

import { useRouter } from 'next/router';

// Menu for Borrowers
function BorrowerMenu() {
	const router = useRouter();

	return (
		<Menu
			mode="inline"
			defaultSelectedKeys={['/transfer']}
			style={{ height: '100%', borderRight: 0 }}
		>
			<Menu.Item key="/transfer" onClick={() => router.push('/borrower/transfer')}>
				Transfer
			</Menu.Item>
			<Menu.Item key="/loans" onClick={() => router.push('/borrower/loans')}>
				Loans
			</Menu.Item>
			<Menu.Item key="/info" onClick={() => router.push('/public/info')}>
				Info
			</Menu.Item>
		</Menu>
	);
}

export default BorrowerMenu;
