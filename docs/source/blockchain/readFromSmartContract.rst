Read Values from Smart Contract
===============================

We discuss about how to read values from a smart contract.  We illustrate the flow of events from React web app (UI) to ``bank-web-app/pages/public/transfer.js`` to ``bank-web-app/components/transfer/TransferController``.

We're gonna to see how to read account balance from the MicroToken smart contract as an example.

.. image:: ../images/account_balance.png
    :width: 130%

As shown in the screenshot above, the ``Transfer`` item in the left menu is common to all users (Bank, Broker, Borrower). 
It directs the user to ``/public/transfer``.
In Next.js, this means directing to the ``pages/public/transfer.js`` file.

``transfer.js`` loads the ``TransferController`` from the ``components/transfer/`` directory as follows: ::

    import React from 'react';
    import { Row, Col } from 'antd';
    import TransferController from '../../components/transfer/TransferController';
    import TokenInfo from '../../components/TokenInfo';

    function Transfer() {
        return (
            <>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <TransferController />
                    </Col>
                    <Col span={24}>
                        <TokenInfo />
                    </Col>
                </Row>
            </>
        );
    }

    export default Transfer;

``TransferController`` is the controller function for token transactions.  In ``TransferController.js``, 
it first imports the necessary dependencies and UI components.
Then it defines the ``balance`` state  and assign the initial value of 0: ::

    const [balance, setBalance] = useState('0');

We access the **MicroToken** smart contract object within *TransferController* using React Context as follows. ::

    const { MicroTokenContract } = useContext(SmartContractContext);

Using this **MicroToken** smart contract, we may call functions in the smart contract. For illustration, we show how to fetch the account balance from the **MicroTokenContract** account using its *balanceOf* method.

The sequence diagram to get token balance of a user is: 

.. image:: ../images/view_balance.png
  :width: 400

The *getBalance* function fetches the account balance from the *MicroTokenContract* 
smart contract. ::

    const getBalance = async () => {
        try {
	       const accounts = await window.ethereum.enable();
	       const response = await MicroTokenContract.methods.balanceOf(accounts[0]).call();
	       setBalance(response);
	 } catch (err) {
	       message.error('Error occured while reading balance');
	}
    };

::

    useEffect(() => {
	getBalance();
    });

This uses the async/await functionality to fetch the account balance from smart contract. 
First, the current in-use account in MetaMask is obtained via ``window.ethereum.enable()``.
Then it calls the *balanceOf* function of *MicroToken* smart contract to obtain the balance of this account.
``response`` is this account's balance and is passed into ``setBalance`` to update the state of the React app.
This is the function we use to fetch data via ``view`` functions of smart contracts.
It will return the account balance and we update the balance state in our application.

In React we can use ``useEffect`` hook call external calls.
The ``useEffect`` hook is invoked when the ``TransferController`` component is rendered to the browser.
The *useEffect* hook calls the *getBalance* method.
It fetches the account balance when a user navigates to the *Transfer* page.

In the ``return`` function of the ``TransferController``, we have the following line. ::

    <Title level={4}>Account balance: {balance}</Title>

It shows the account balance as shown in the above **Microfinance** screenshot.
*Title* is a component from Ant design and ``{balance}`` is given the *balance* React state value.
When it changes, React will automatically and visually update the necessary portion in the broswer as well.

This is how we fetch data from smart contracts and render it in a browser using smart contract, the ``call()`` method, and React states.



