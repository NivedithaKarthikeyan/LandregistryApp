.. Microfinance documentation master file, created by
   sphinx-quickstart on Wed Aug 25 19:56:33 2021.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

.. warning::
   The Microfinance project source code and documentation is shared with you for learning purposes only. It should not be commercialized or used for profit purposes.
   
Welcome to Microfinance dApp Documentation
==========================================

.. image:: images/tcard_microfinance.png

..

.. toctree::
   :maxdepth: 2
   :caption: Introduction

   introduction/applicationOverview
   introduction/functionalities

.. toctree::
   :maxdepth: 2
   :caption: Installation Guide

   installation/guide
   installation/checkout
   installation/deploySmartContract
   installation/metamask
   installation/bankServer
   installation/bankApp
   installation/connectReactMetaMask

.. 
   toctree::
   :maxdepth: 2
   :caption: Deploy to Ropsten

   deployToRopsten/guide

.. toctree::
   :maxdepth: 3
   :caption: Smart Contracts

   blockchain/introduction
   blockchain/smartContracts
   blockchain/migration
   blockchain/truffleConfig


.. toctree::
   :maxdepth: 2
   :caption: Bank Web Server

   bankServer/introduction
   bankServer/index
   bankServer/layeredArchitecture
   
.. toctree::
   :maxdepth: 2
   :caption: Bank Web Application

   bankClient/introduction
   bankClient/userContext
   bankClient/smartContractContext

.. toctree::
   :maxdepth: 2
   :caption: Event Flows

   eventFlow/guide
   eventFlow/introduction
   eventFlow/readFromSmartContract
   eventFlow/saveValuesToSmartContract
   eventFlow/applyLoan
   eventFlow/createLoanPlan
   eventFlow/plansTable
   eventFlow/loans
   eventFlow/transferTokens
   eventFlow/loanPayment

.. toctree::
   :maxdepth: 2
   :caption: Quickstart

   quickstart/instructions
