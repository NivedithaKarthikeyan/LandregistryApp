import React from 'react';
import '../styles/globals.css';

import BasicLayout from '../components/BasicLayout';
import { AuthContextProvider } from '../stores/authContext';

function MyApp({ Component, pageProps }) {
	return (
		<AuthContextProvider>
			<BasicLayout>
				<Component {...pageProps} />
			</BasicLayout>
		</AuthContextProvider>
	);
}

export default MyApp;
