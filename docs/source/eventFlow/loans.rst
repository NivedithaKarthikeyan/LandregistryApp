Loans Table Event Flows
=======================

Loans table is displayed for ``Broker``, ``Borrower``, ``Bank`` users.

``Broker`` view. 

.. figure:: ../images/broker_loan.png

``Bank`` view. 

.. figure:: ../images/bank_loan.png

``Borrower`` view. 

.. figure:: ../images/borrower_loan.png


``Loans`` menu item is common for all 3 user roles.
These Menus are defined in the ``/component/menu/`` directory.
All ``BrokerMenu``, ``BankMenu``, and ``BorrowerMenu`` components defined the ``Loans`` menu item as follows. ::

  <Menu.Item key="/loans" onClick={() => router.push('/common/loans')}>
    Loans
  </Menu.Item>

As you can see on the address bars of the above 3 screenshots it contains the address value ``localhost:3005/common/loans``
These 3 distinct menu items will load ``bank-web-app/pages/common/loans.js`` page.

We illustrate the flow of events from React web app (UI) to 
``bank-web-app/pages/common/loans.js`` to ``bank-web-app/components/loan/LoansTable.js``.

loans.js
--------

script of the ``loans.js``. ::

  import React from 'react';
  import { Row, Col } from 'antd';
  import LoansTable from '../../components/loan/LoansTable';

  function Loans() {
    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <LoansTable />
        </Col>
      </Row>
    );
  }

  export default Loans;

In the above script, first it imports dependencies. 
In addition to the React and Ant design dependencies it imports ``LoansTable`` component 
from the ``/components/loan/LoansTable``.
It specify the relative path to the ``LoansTable`` in the ``import`` line.

This script defines the ``Loans`` component and it displays the ``LoansTable`` component and 
aligns it using ``Row`` and ``Col`` Ant design components.

LoansTable.js
-------------

Since ``LoansTable`` common for all users it contains many functions and conditional rendering compenents.

First, ``LoansTable`` component imports dependencies. ::

  import React, { useState, useContext, useEffect } from 'react';
  import { Table, Tag, Card, Divider, message, Modal, Form, Space, Button } from 'antd';
  import { getApi } from '../../util/fetchApi';
  import UserContext from '../../stores/userContext';
  import SmartContractContext from '../../stores/smartContractContext';

* ``getApi`` to fetch data from **Bank Web Server**
* ``UserContext`` to get the selected user role.
* ``SmartContractContext`` to access smart contract related context objects to interact with them.

It gets the selected user from ``UserContext``. ::

  const { user } = useContext(UserContext);

It uses the ``MicroTokenContract``, ``BankLoanContract``, and ``UserIdentityContract`` 
smart contract objects and access them from ``SmartContractContext``. ::

	const { MicroTokenContract, BankLoanContract, UserIdentityContract } = useContext(SmartContractContext);

Loan has different states.
These states maintain usin ``ENUM`` in ``BankLoan`` smart contract.
But these states will return from ``BankLoan`` smart contract as integer values.
To add meaning to these integer states we keep same states array by keeping the same order in the ``LoansTable`` as 
they defined in the ``BankLoan`` smart contract. ::

  const state = ['REQUESTED', 'BORROWER_SIGNED', 'BANK_APPROVED', 'BANK_REJECTED',
		'PAID_TO_BROKER', 'ONGOING', 'DEFAULT', 'CLOSE'];

Integer values returning from ``BankLoan.sol`` states are equal to the ``states`` index values.

``LoansTable`` has following states. ::

  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false); // Loan approve confirmation modal visibility state.
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false); // Loan remove modal visibility state.
  const [isBrokerTransferModalVisible, setIsBrokerTransferModalVisible] = useState(false);
  const [isBorrowerTransferModalVisible, setIsBorrowerTransferModalVisible] = useState(false);
  const [id, setId] = useState(0);
  const [loanRecord, setLoanRecord] = useState({});
  const [current, setCurrent] = useState(0);
  const [payments, setPayments] = useState([]);
  const [data, setData] = useState([]);

* ``isApproveModalVisible`` - Loan Approval Modal visibility state.
* ``isRejectModalVisible`` - Loan Reject Modal visibility state.
* ``isBrokerTransferModalVisible`` - Visibility state of the Modal which is transfering tokens from ``Bank`` to ``Broker``.
* ``isBorrowerTransferModalVisible`` - Visibility state of the Modal which is transfering loan token amount from ``Bank`` to ``Broker``.
* ``id`` - Loan id state.
* ``loanRecord`` - Active Loan state.
* ``current`` - Current stage state of transfering tokens and update loan process.
* ``payments`` - Loan Payments state.
* ``data`` - Loan data.

Following 2 objects will store the registered ``Brokers`` and ``Borrowers`` details.
We use plain objects to keep a map of users wallet addresses and their names.
We use Plain JavaScript object instead of using JavaScript ``Maps`` because we just store and retrive data from this map objects. ::

  const brokers = {};
  const borrowers = {};

Get Brokers Data
~~~~~~~~~~~~~~~~~~

``LoansTable`` component contains a ``getBrokers`` function to get registered ``Brokers`` details from the ``UserIdentity`` smart contract.
It gets the ``Brokers`` data using ``UserIdentityContract`` smart contract object from the ``SmartContractContext`` and
``getAllBrokers`` public method defined in the ``UserIdentity.sol`` smart contract.

When ``getBrokers`` function gets the results from the smart contract call it will map ``Broker`` names to their wallet addresses as 
follows. ::

  const getBrokers = async () => {
    const response = await UserIdentityContract.methods.getAllBrokers().call();
    for (let i = 0; i < response.length; i++) {
      brokers[response[i].walletAddress] = response[i].name;
    }
  };

Get Borroers Data
~~~~~~~~~~~~~~~~~

``getBorrowers`` function will get the registered Borrowers details from the ``UserIdentity`` smart contract 
using ``UserIdentityContract`` smart contract object and ``getAllBorrowers`` method of the `UserIdentity.sol`` smart contract.

This function will update the ``borrowers`` object by mapping the ``Borrowers`` names in to their wallet addresses. ::

  const getBorrowers = async () => {
    const response = await UserIdentityContract.methods.getAllBorrowers().call();
    for (let i = 0; i < response.length; i++) {
      borrowers[response[i].walletAddress] = response[i].name;
    }
  };

Get Loan Payments Data
~~~~~~~~~~~~~~~~~~~~~~

``LoansTable`` defines a ``getPayments`` method to fetch Loan Payment data from the **Bank Web Server**.
``getPayments`` method fech data from ``loan-payments`` api end point using GET method.
It uses the ``getApi`` function in the ``/util/fetchApi.js`` script.

Results will be set to the ``payments`` state defined above using ``setPayments`` method. ::

  const getPayments = async () => {
    try {
      const response = await getApi({
        url: 'loan-payments',
      });
      const paymentsResult = await response;
      setPayments(paymentsResult);
    } catch (err) {
      console.log(err);
      message.error('Error occured while loading Loan Payments');
    }
  };

Get Loans Data
~~~~~~~~~~~~~~

``getLoans`` function will fetch ``Loans`` datafrom the ``BankLoan`` smart contract using ``getLoans`` method defined in the 
``BankLoan.sol`` smart contract.
We use ``BankLoanContract`` from the ``SmartContractContext`` to call the ``getLoans`` method.

After fetching data from ``BankLoan`` smart contract, then it resets the ``data`` state.
Then map each Loan data into a JavaScript object and append it to the ``data`` array state.
In addition to returned Loan data values from the ``BankLoan`` smart contract this JavaScript object 
keeps the ``brokerName`` and ``borrowerName`` properties.
``brokerName`` and ``borrowerName`` value will be updated using ``broker`` and ``borrower`` objects respectively. 
We can pass the ``Broker's`` and ``Borrower's`` wallet addresses in to these objects and get the names of them.

It uses the spread operator ``...prev`` in the ``setData`` method below. ::

  const getLoans = async () => {
    try {
      const response = await BankLoanContract.methods.getLoans().call();

      setData([]);

      for (let i = 0; i < response.length; i++) {
        const row = {
          key: response[i].id,
          id: response[i].id,
          amount: response[i].amount,
          period: response[i].months,
          interest: response[i].interest,
          planId: response[i].planId,
          borrowerName: borrowers[response[i].borrower],
          borrower: response[i].borrower,
          brokerFee: response[i].brokerFee,
          brokerName: brokers[response[i].broker],
          broker: response[i].broker,
          status: response[i].state,
        };

        setData((prev) => {
          return [...prev, row];
        });
      }
    } catch (err) {
      console.log(err);
      message.error('Error occured while loading current Loans');
    }
  };

Load Initial Data
~~~~~~~~~~~~~~~~~

Above 4 functions will load the essential data to be displayed in the ``Loans Table``.
``LoansTable`` component has ``loadData`` function to trigger those 4 functions. ::

  const loadData = async () => {
    await getBrokers();
    await getBorrowers();
    await getPayments();
    await getLoans();
  };

Then later part of the ``LoansTable`` component it uses ``useEffect`` hook to load those essential data at the
``LoansTable`` component mounting time. ::

  useEffect(() => {
    loadData();
    ...
  }, []);

This ``useEffect`` hook will triggers the ``loadData`` function at the ``LoansTable`` mounting time.
Since this ``useEffect`` hook dependency array is empty, it will execute one time only.

Registering for loanRequest event of the BankLoan Smart contract
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

After executing the ``loadData`` function, ``useEffect`` hook will register an event listner to ``loanRequest`` event of the 
``BankLoan`` smart contract.

we pass 2 parameters to this ``loanRequest`` event funcion.
First parameter object contains the ``fromBlock`` property value.
This property specify the events staring block of the blockchain.
This event listner gets the events emit after the ``latest`` block of the blockchain.

Second parameter defines the callback function.
This function gets the event results of the ``loanRequest`` event.
This ``loanRequest`` events returns the newly created ``Loan`` data.
These new ``Loan`` data will map to a JavaScript object and append to the ``data`` state array.
This event helps to update the ``Loans Table`` with newly created ``Loans``. ::

  const emitter = BankLoanContract.events.loanRequest({ fromBlock: 'latest' }, (error, response) => {
    const result = response.returnValues;

    const row = {
      key: result.id,
      id: result.id,
      amount: result.amount,
      period: result.months,
      interest: result.interest,
      planId: result.planId,
      borrower: result.borrower,
      brokerFee: result.brokerFee,
      broker: result.broker,
      status: result.state,
    };

    setData((prev) => {
      return [...prev, row];
    });
  });

  return () => {
    emitter.unsubscribe();
  };

To unsubscribe to this event we call the ``unsubscribe`` method in the ``return`` section.
This return method will execute when ``LoansTable`` dismount from the UI.

Complete ``useEffect`` hook script. ::

  useEffect(() => {
    loadData();
    const emitter = BankLoanContract.events.loanRequest({ fromBlock: 'latest' }, (error, response) => {
      const result = response.returnValues;

      const row = {
        key: result.id,
        id: result.id,
        amount: result.amount,
        period: result.months,
        interest: result.interest,
        planId: result.planId,
        borrower: result.borrower,
        brokerFee: result.brokerFee,
        broker: result.broker,
        status: result.state,
      };

      setData((prev) => {
        return [...prev, row];
      });
    });

    return () => {
      emitter.unsubscribe();
    };
  }, []);

Initial Loan Table Columns
~~~~~~~~~~~~~~~~~~~~~~~~~~

As we mentioned above Loans Table is displayed for all 3 user roles.
``LoansTable`` component defines the ``columns`` array which contains the Loans Table columns. ::

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Borrower Name',
      dataIndex: 'borrowerName',
      key: 'borrowerName',
    },
    {
      title: 'Broker Name',
      dataIndex: 'brokerName',
      key: 'brokerName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Interest %',
      key: 'interest',
      dataIndex: 'interest',
    },
    {
      title: 'Broker Fee',
      key: 'brokerFee',
      dataIndex: 'brokerFee',
    },
    {
      title: 'Plan ID',
      key: 'planId',
      dataIndex: 'planId',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: tag => {
        let color = 'geekblue';
        if (tag === '3' || tag === '6') {
          color = 'red';
        } else if (tag === '2' || tag === '5') {
          color = 'green';
        }
        return (
          <Tag color={color} key={tag}>
            {state[tag]}
          </Tag>
        );
      },
    },
  ];

All columns objects have following properties.

* ``title`` - Column name.
* ``dataIndex`` - Loan object property to disply in the column.
* ``key`` - Unique identifier for the column.

``Status`` column has ``render`` property to do a conditional rendering. ::

  render: tag => {
    let color = 'geekblue';
    if (tag === '3' || tag === '6') {
      color = 'red';
    } else if (tag === '2' || tag === '5') {
      color = 'green';
    }
    return (
      <Tag color={color} key={tag}>
        {state[tag]}
      </Tag>
    );
  },

This ``Status`` column displays the Loan state using ``Tag`` Ant design component and change the color of the ``Tag`` according to 
the ``loanState`` value. 

Initial Loan Table view for ``Borrower``. 

.. figure:: ../images/borrower_loan_row.png

Initial Loan Table view for ``Bank``.

.. figure:: ../images/bank_loan_row.png

Initial Loan Table view for ``Broker``.

.. figure:: ../images/broker_loan_row.png