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
