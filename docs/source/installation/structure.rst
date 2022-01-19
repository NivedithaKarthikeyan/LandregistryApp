.. _project-structure-target:

Project Structure
=================

Here is the folder structure of Microfinance system. This system consists of 3 main projects and one project for documentation 
as shown below. ::

    Microfinance
    |--bank-server
    |--bank-web-app
    |--blockchain
    |--docs


1. ``bank-server/``: Node Server project for Bank.
2. ``bank-web-app/``: React web application for Bank.
3. ``blockchain/``: Truffle project for develop and deploy smart contracts
4. ``docs/``: Directory for Sphinx documnets.

Deployment Diagram
-------------------

.. image:: ../images/deployment.png

As shown in the diagram the Bank has a web application developed using React.
This Bank web application connects to the Bank web server.
This React web applciation to Node Server connection uses HTTP.
Bank web server consists of Node.js HTTP server component and a Mongo DB database component. 
Bank web application connects to blockchain using Web3.
