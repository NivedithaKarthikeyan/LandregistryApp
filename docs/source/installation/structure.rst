.. _project-structure-target:

Project Structure
=================

Here is the folder structure of the Microfinance system. It consists of three main projects and one project for documentation as shown below: ::

    Microfinance
    |--bank-server
    |--bank-web-app
    |--blockchain
    |--docs


1. ``bank-server/``: Node Server project for Bank.
2. ``bank-web-app/``: React web application for Bank.
3. ``blockchain/``: Truffle project blockchain smart contracts.
4. ``docs/``: Documentation for readthedocs.org.

Deployment Diagram
-------------------

.. image:: ../images/deployment.png

As shown in the diagram, the Bank has a web application developed using React.
This web app connects using HTTP to the Bank web server, which consists of a Node.js HTTP server component and a Mongo DB database component. 
The Bank web application connects to a blockchain using Web3.
