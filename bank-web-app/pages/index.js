import React, { useContext, useEffect } from 'react';
// import { useRouter } from 'next/router';

import { Spin } from 'antd';
// import AuthContext from '../stores/authContext';

export default function Home() {
	// const router = useRouter();
	// const { user } = useContext(AuthContext);

	// useEffect(() => {
	// 	{user.role == 'broker' && router.push('/broker/transfer')}
	// 	{user.role == 'bank' && router.push('/bank/plans')}
	// }, []);

	return (
		<div style={{ 'margin': 'auto' }}>
			<Spin size="large" />
		</div>
	);
}
