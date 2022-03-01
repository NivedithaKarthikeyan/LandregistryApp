Page Navigation with Menu Items
===============================

There are 3 Menus load in the **Microfinance - Bank UI** according to the user role.
These menus defined in the ``bank-web-app/components/menu`` directoy.

* ``BankMenu.js`` - Menu for Bank users.
* ``BorrowerMenu.js`` - Menu for Borrowers.
* ``BrokerMenu.js`` - Menu for Brokers.


Each menu item loads ``pages`` from ``bank-web-page/pages`` directory.
You can get idea about which page loads with which menu item by looking at the address bar.
Please refer the following screenshot of the ``Microfinance - Bank UI``.

.. image:: ../images/transfer_page.png

As you can see in the screeshot; selected user role is ``Broker`` and ``BrokerMenu`` loaded in the left panel.
``BrokerMenu`` has 4 menu items and ``Transfer`` menu item has been selected.
Address bar contains the ``localhost:3005/public/transfer``. 
This means ``Transfer`` menu item loads the script in ``pages/public/transfer.js``.

We will discuss more about persisting the Layout and loanding pages in across the **React Web Application** in ``level2``

We discuss about some selected Event Flows in next sections.

