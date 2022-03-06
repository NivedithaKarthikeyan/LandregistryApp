.. _usercontext:

User Context
============

There are a number of user roles in the Microfinance project: bank, broker, borrow, public, etc.
``stores/userContext`` contains these details.
It stores the current user and provide functionality to change the user.
This follows the React Context concepts.  More information about this `here <https://reactjs.org/docs/context.html>`_.

Import Dependencies
-------------------

First, it imports dependencies: ::

    import React, { createContext, useState, useEffect } from 'react';
    import { useRouter } from 'next/router';

``UserContext`` uses the ``createContext`` and ``useState`` hooks.
It uses the router mechanism from the ``Next.js`` framework.
You can learn more about this in the 
`Next Js Routing page <https://nextjs.org/docs/routing/introduction>`_ and the
`next/router page <https://nextjs.org/docs/api-reference/next/router>`_.

UserContext
-----------

We define ``UserContext`` with the default values as follows: ::

	const UserContext = createContext({
		user: null,
		login: () => {},
	});

Then we define the ``UserContextProvider`` function.

UserContextProvider
-------------------

First, we define a router variable to update the router according to user roles and page navigation as follows: ::

	const router = useRouter();


Then we define the ``users`` of the system as an array with 4 users, one for each user role in the system.
These users are used for testing purposes only; otherwise, we have to implement a login mechanism in the system.
The ``user`` objects in ``users`` contains ``user`` name and metadata about ``user`` as follows: ::

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

We set the ``user`` state from the ``users`` array, where ``user[1]`` is the user when the system loads: ::

	const [user, setUser] = useState(users[1]);

Next we use the ``useEffect`` hook to update the router whenever the ``user`` state  changes: ::

	useEffect(() => {
		if (user.role === 'broker') {
			router.push('/public/transfer');
		} else if (user.role === 'bank') {
			router.push('/bank/loans');
		} else if (user.role === 'borrower') {
			router.push('/borrower/transfer');
		}
	}, [user]);


We define a ``login`` function to update the ``user`` state. ::

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

It updates the ``user`` state according to the user role we pass to this function.

We define the context value and pass the ``user`` state and ``login`` function. ::

	const context = { user, login };

This object will pass as the Context Provider value parameter as follows. ::

	return (
		<UserContext.Provider value={context}>
			{children}
		</UserContext.Provider>
	);

This ``user`` state and ``login`` function can be accessed by any script in the project.

Complete userContext Script
---------------------------

::

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
