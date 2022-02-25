User Context
============

``userContext`` is providing user details.
It stores the current user and provide functionality to change the user.
This follows the React Context concepts. Find more about `Context <https://reactjs.org/docs/context.html>`_.

Import Dependencies
-------------------

First it imports following dependencies. ::

    import React, { createContext, useState, useEffect } from 'react';
    import { useRouter } from 'next/router';

``UserContext`` uses the ``createContext`` and ``useState`` hooks.
It will use router mechanism from the ``Next.js`` framework.
You can learn more about Next.js routing in 
`Next Js Routing page <https://nextjs.org/docs/routing/introduction>`_ and 
`next/router page <https://nextjs.org/docs/api-reference/next/router>`_.

UserContext
-----------

Then define the UserContext with the default values as follows. ::

	const UserContext = createContext({
		user: null,
		login: () => {},
	});

Then it defines the ``UserContextProvider`` function.

UserContextProvider
-------------------

First we define next router as follows. ::

	const router = useRouter();

This router variable helps to update the router according to the user roles and page navigation.

Then we define the ``users`` of the system.
``users`` array contains 4 users from each user role in the system.
These users are used to testing purposes only. 
If not we have to implement a login mechanism to the system.
``user`` objects in the ``users`` contains ``user`` name and some meta data about ``user`` as follows. ::

	const users = [
		{
			name: 'Leonard Hofstadter',
			role: 'broker',
			color: '#87d068',
		},
		{
			name: 'Sheldon Cooper',
			role: 'bank',
			color: '#8193E7',
		},
		{
			name: 'Rajesh Koothrapali',
			role: 'borrower',
			color: '#8193E7',
		},
		{
			name: 'Guest',
			role: 'public',
			color: '#8193E7',
		},
	];

We set update the ``user`` state from the ``users`` array. ::

	const [user, setUser] = useState(users[1]);

We set the ``user[1]`` as the user of the system when it loads.
Next we use ``useEffect`` function to update the router according to the user change. ::

	useEffect(() => {
		if (user.role === 'broker') {
			router.push('/public/transfer');
		} else if (user.role === 'bank') {
			router.push('/bank/loans');
		} else if (user.role === 'borrower') {
			router.push('/borrower/transfer');
		}
	}, [user]);

This ``useEffect`` hook will triggered every time it updates the ``user`` state and update the router.

We define ``login`` function to update the ``user`` state. ::

	const login = (role) => {
		if (role === 'broker') {
			setUser(users[0]);
		} else if (role === 'bank') {
			setUser(users[1]);
		} else if (role === 'borrower') {
			setUser(users[2]);
		} else if (role === 'public') {
			setUser(users[3]);
		}
	};

It updates the ``user`` state according to the user role we pass in to this function.

Then we define the context value and pass the ``user`` state and ``login`` function. ::

	const context = { user, login };

This object will pass as the Context Provide value parameter as follows. ::

	return (
		<UserContext.Provider value={context}>
			{children}
		</UserContext.Provider>
	);

This ``user`` state and ``login`` function can be accessed by any script in the project.

Complete userContext Script
---------------------------

Complete ``userContext`` script. ::

    import React, { createContext, useState, useEffect } from 'react';
	import { useRouter } from 'next/router';

	// Create context and set default values.
	const UserContext = createContext({
		user: null,
		login: () => {},
	});

	export const UserContextProvider = ({ children }) => {
		const users = [
			{
				name: 'Leonard Hofstadter',
				role: 'broker',
				color: '#87d068',
			},
			{
				name: 'Sheldon Cooper',
				role: 'bank',
				color: '#8193E7',
			},
			{
				name: 'Rajesh Koothrapali',
				role: 'borrower',
				color: '#8193E7',
			},
			{
				name: 'Guest',
				role: 'public',
				color: '#8193E7',
			},
		];

		const [user, setUser] = useState(users[1]);

		const router = useRouter();

		useEffect(() => {
			// Router will update according to the selected user role.
			if (user.role === 'broker') {
				router.push('/public/transfer');
			} else if (user.role === 'bank') {
				router.push('/bank/loans');
			} else if (user.role === 'borrower') {
				router.push('/borrower/transfer');
			}
		}, [user]); // useEffect will execute when user context value changes.

		const login = (role) => {
			if (role === 'broker') {
				setUser(users[0]);
			} else if (role === 'bank') {
				setUser(users[1]);
			} else if (role === 'borrower') {
				setUser(users[2]);
			} else if (role === 'public') {
				setUser(users[3]);
			}
		};

		const context = { user, login };

		return (
			<UserContext.Provider value={context}>
				{children}
			</UserContext.Provider>
		);
	};

	export default UserContext;
