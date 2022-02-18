Smart Contracts
===============

This project has three smart contracts. 
They reside in the ``contracts`` directory. ::

    Microfinance
        |--blockchain
        |  |--contracts
        |  |  |--BankLoan.sol
        |  |  |--MicroToken.sol
        |  |  |--Migrations.sol
        |  |  |--UserIdentity.sol
        |  |--migrations
        |  |--test
        |  |--truffle-config.js


Micro Token Smart Contract - MicroToken.sol
-------------------------------------------

This smart contract handles the **ERC20** token in the system. 
ERC20 is a technical standard used for smart contracts on the Ethereum blockchain for implementing tokens. It defines a common list of rules and constraints that an Ethereum token has to implement, giving developers a standard pattern to program how new tokens will function within the Ethereum ecosystem. 
All ERC20 token-related information such as token name, total supply, and functionalities like transfer tokens, account balances, are handled through this contract. 
More information `here <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol>`_.


The ``MicroToken`` smart contract implements the ``IERC20`` smart contract interface.


Attributes
~~~~~~~~~~

The ``MicroToken`` smart contract has these token related attributes: ::

    string public constant symbol = "MFT";
    string public constant name = "Microfinance Token";
    uint8 public constant decimals = 0;
    uint private constant __totalSupply = 1000;
    mapping (address => uint) private __balanceOf;
    mapping (address => mapping (address => uint)) private __allowances;

* ``symbol``: Symbol of the ERC20. This symbol will show in wallets and other places.
* ``name``: Name of the token. In this project, our token name is ``Microfinance Token (MFT)``.
* ``decimals``: This attribute configures the number of decimal places we use in our token. We set it to 0 as we don't use decimal values.
* ``__totalSupply``: This attribute holds the total number of tokens in circulation in the system.
* ``__balanceOf``: This mapping contains the token balance of each account holder.
* ``__allowances``: Account owner may grant permission to another account to do the token transfers on behalf of him. But owner can grant permission for limited token amount only. This mapping holds the number of tokens allowed to transfer from one account to another by third party account.

Constructor
~~~~~~~~~~~

The following code segment is the ``constructor`` of the MicroToken smart contract: ::

    constructor() {
            __balanceOf[msg.sender] = __totalSupply;
    }

It assigns all the tokens (``__totalSupply``) to the smart contract deployer's (``msg.sender``) account, which in the **Microfinance** system is the Bank.  The Bank owns all the tokens.  So the Bank account (in MetaMask/blockchain) should deploy this smart contract to assume ownership.

Functions
~~~~~~~~~

We discuss the various things the ``MicroToken`` smart contract should do.
Since ``MicroToken.sol`` contract implements the ``IERC20`` interface form **OpenZeppelin**, you can find more about these functions 
from the `github IERC20 repo <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol>`_.

totalSupply
^^^^^^^^^^^

This function returns the ``__totalSupply`` of the token. 
It is a public function: ::

    function totalSupply() public pure override returns (uint _totalSupply) { 
        _totalSupply = __totalSupply;
    }

balanceOf
^^^^^^^^^

This function returns the token balance of given account. An account address should be passed as a parameter to this function. 
It is a public function: ::

    function balanceOf(address _addr) public view override returns (uint balance) {
        return __balanceOf[_addr];
    }

transfer
^^^^^^^^

This function transfers tokens from one account to another. 
Tokens are transferred from the caller's (``msg.sender``) account. ``_to`` is the receiving account and ``_value `` is the token amount. 
This function returns true if transfer is successfull and false otherwise. ::

    function transfer(address _to, uint _value) public override returns (bool success) {
        if (_value > 0 && _value <= balanceOf(msg.sender)) {
            __balanceOf[msg.sender] -= _value;
            __balanceOf[_to] += _value;
            return true;
    }
        return false;
    }

transferFrom
^^^^^^^^^^^^

This functions transfer tokens from one account to another by a third-party account. 
Before transfer the tokens it may check some conditions. 
Sender account address pass as the ``_from`` parameter and receiver's account address pass as the ``_to`` parameter.
Token amount pass as the ``_value`` parameter to this functions.
It will return ``true`` if successfull or ``false`` otherwise. ::

    function transferFrom(address _from, address _to, uint _value) public override returns (bool success) {
        if (__allowances[_from][msg.sender] > 0 &&
            _value > 0 &&
            __allowances[_from][msg.sender] >= _value &&
            __balanceOf[_from] >= _value) {
            __balanceOf[_from] -= _value;
            __balanceOf[_to] += _value;
                __allowances[_from][msg.sender] -= _value;
            return true;
    }
        return false;
    }


approve
^^^^^^^

Owner can grant permission to transfer some tokens from his account by sender. 
To grant permission owner should ``approve`` the spender's account address ``_spender`` and the token amount ``_value``.
This function returns ``true`` if it is successfull. ::

    function approve(address _spender, uint _value) public override returns (bool success) {
        __allowances[msg.sender][_spender] = _value;
        return true;
    }

allowance
^^^^^^^^^

This function returns the remaining token allowance from ``_owner`` account to ``_spender``, 
the two account addresses pass as the parameters for this function. ::

    function allowance(address _owner, address _spender) public view override returns (uint remaining) {
            return __allowances[_owner][_spender];
    }

User Identity Smart contract - UserIdentity.sol
------------------------------------------------

This contract holds the User details of the Microfinance system. It will register all Broker, Borrower and Insurance Co. details.
In this section we discuss about ``UserIdentity.sol`` in detail.

ENUM
~~~~

Role - This enum holds user role values of the system. There 3 user roles in the system. ::

    enum Role { GUEST, BROKER, BORROWER }

Structs
~~~~~~~

User - This struct holds the user attributes. ::

    struct User{
        uint id; 
        string socialSecurityId; // each property has an unique social security id
        address userAddress;
        string name;
        Role role;
        bool isBankApproved;
    }

* ``id`` - System assigned id number for the user. This is an incremental number.
* ``socialSecurityId`` - This attribute holds the social security number.
* ``userAddress`` - User wallet account address. Wallet acount address from Ganache.
* ``name`` - User name
* ``role`` - User role(BROKER, BORROWER)
* ``isBankApproved`` - Bank approval.

Modifiers
~~~~~~~~~

The following modifiers are used in the ``UserIdentity.sol`` functions.

* ``isAdmin()`` - Checks the function caller is the admin of the contract.

Attributes
~~~~~~~~~~

``UserIdentity.sol`` contains the following attributes. 

* ``admin`` - Holds the deployer account address of the smart contract. 
* ``brokersCount`` - Holds the total brokers in the system. 
* ``borrowersCount`` - Holds the total borrowers in the system.
    
* ``borrowers`` - This mapping holds all the borrowers details in the system. (address to Borrower mapping)
* ``brokers`` - This mapping holds all the brokers details in the system. (address to User mapping)
    
* ``brokersAddresses`` - This array contains all the brokers addresses.
* ``borrowersAddresses`` - This array contains all the borrowers addresses.

Constructor
~~~~~~~~~~~

The constructor will assign the owner address as the contract deployer(``msg.sender``) address. ::

    constructor()
    {
        admin = msg.sender;
    }


Functions
~~~~~~~~~

addBroker
^^^^^^^^^

This function adds the new Broker account to the system. ::

    function addBroker(string memory _socialSecurityId, address _address, string memory _name) 
        public isAdmin()

Parameters:
    * ``_socialSecurityId`` - Social Security ID of the Broker.
    * ``_address`` - Wallet account address of the Broker.
    * ``_name`` - Broker name.

Modifiers:
    * ``isAdmin()`` - Checks function caller is the Admin of the smart contract.

addBorrower
^^^^^^^^^^^

This function adds the new Borrower account to the system. ::

    function addBorrower(string memory _socialSecurityId, address _address, string memory _name) 
        public isAdmin()

Parameters:
    * ``_socialSecurityId`` - Social Security ID of the Broker.
    * ``_address`` - Wallet account address of the Borrower.
    * ``_name`` - Borrower name.

Modifiers:
    * ``isAdmin()`` - Checks function caller is the Admin of the smart contract.

verifyIsBroker
^^^^^^^^^^^^^^

This function verifies given account address is a Broker account or not. ::

    function verifyIsBroker(address _address) public view returns(bool)

Parameters:
    * ``_address`` - The account address of the user

This function is used by other smart contracts to verify a Broker account. 
This function will return ``true`` if brokers exists on the given address or ``false`` otherwise.

verifyIsBorrower
^^^^^^^^^^^^^^^^^

This function verifies given account address is a Borrower account or not. ::

    function verifyIsBorrower(address _address) public view returns(bool)

Parameters:
    * ``_address`` - The account address of the user

This function is used by other smart contracts to verify a Borrower account. 
This function will return ``true`` if Borrower exists on the given address or ``false`` otherwise.

getAllBrokers
^^^^^^^^^^^^^

This function returns all the Brokers as an array. ::

    function getAllBrokers() public view returns (User[] memory)

Return: 
    * ``User []`` - Return all Brokers as an array.

getAllBorrowers
^^^^^^^^^^^^^^^

This functions returns all the Borrowers as an array. ::

    function getAllBorrowers() public view returns (User[] memory)

Return: 
    * ``User []`` - Return all Borrowers as an array.

Bank Loan Smart Contract - BankLoan.sol
---------------------------------------

This smart contract stores the Bank Loan details. 
The Bank is the owner of this smart contract.
The following sections describe the components of the smart contract.

State Transition Diagram of The Bank Loan
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following diagram shows the state transition of a Bank Loan.
We follow this state transition diagram to implement the Bank Loan state changes in ``BankLoan`` smart contract.

.. image:: ../images/state_transition_bank_loan.png

ENUM
~~~~

1. LoanState - This enum holds individual loan states. There are 14 loan states. ::

    enum LoanState{
        REQUESTED, 
        BORROWER_SIGNED,
        BANK_APPROVED, 
        BANK_REJECTED,
        PAID_TO_BROKER, 
        ONGOING, 
        DEFAULT, 
        CLOSE
    }

* ``REQUESTED`` - Initial state of a loan. Broker request a loan. 
* ``BORROWER_SIGNED`` -Borrower agreed for the Loan. 
* ``BANK_APPROVED`` - Bank approved the Loan
* ``BANK_REJECTED`` - Bank rejected the Loan
* ``PAID_TO_BROKER`` - Bank paid the Broker fee.
* ``ONGOING`` - Bank transfer tokens to the Borrower's account. 
* ``DEFAULT`` - Borrower unable to pay back the Loan. 
* ``CLOSE`` - Borrower paid back the Loan.


Structs
~~~~~~~

1. Loan - This struct holds the Loan attributes. ::

    struct Loan
    {
        uint id;
        uint amount;
        uint months;
        uint interest;
        string planId;
        LoanState state;
        address broker;
        address borrower;
        bool bankApprove;
        bool isBorrowerSigned;
    }

* ``id`` - Loan Id
* ``amount`` - Loan amount
* ``months`` - Loan duration in months.
* ``interest`` - Loan interest
* ``planId`` - Loan plan Id
* ``state`` - Current state of the loan
* ``broker`` - Address of the Broker who applied the Loan.
* ``borrower`` - Address of the Borrower of the Loan
* ``bankApprove`` - Status of the Bank approval for the Loan
* ``isBorrowerSigned`` - Borrower Signed status.

Events
~~~~~~

These events were defined in the ``BankLoan`` smart contract.

loanRequest
^^^^^^^^^^^

This event will emit when Broker create a loan request. ::

    event loanRequest(
        uint id,
        uint amount,
        uint months, 
        uint interest,
        uint planId, 
        LoanState state, 
        address broker, 
        address borrower,
        bool bankApprove, 
        bool isBorrowerSigned,
    );

Parameters:
    * ``id`` -  Loan Id
    * ``amount`` - Loan amount
    * ``months`` - Duration of the loan
    * ``interest`` - Loan interest
    * ``planId`` - Loan plan id
    * ``state`` - Current state of the loan
    * ``broker`` - Broker of the loan
    * ``borrower`` - Borrower address of the loan
    * ``bankApprove`` - Bank approval status
    * ``isBorrowerSigned`` - Borrower signed status


Modifiers
~~~~~~~~~

The following modifiers are used in the ``BankLoan.sol`` functions.

* ``isAdmin()`` - Checks the function callers is the owner of the smart contract.
* ``isBroker()`` - Checks the functiona caller is registered as a Broker in the system.
* ``isLoanBorrower(uint _loanId)`` - Checks the function callers is the Borrower of the given Loan.
* ``isValidLoan(uint _loanId)`` - Checks Loan exists in the system.
* ``isLoanIn(uint _loanId, LoanState _state)`` - Checks the given Loan is in given Loan State.

Attributes
~~~~~~~~~~

* ``UserIdentity: identitySC`` -  Stores UserIdentity smart contract object
* ``address: admin`` - Store smart contract deployer’s address 
* ``Loan[]: loans`` - Stores loan data

Constructor
~~~~~~~~~~~

The constructor will assign the admin address as the contract deployer(``msg.sender``) address. 
It will require the ``UserIdentity`` smart contract address to deploy the smart contract. 
``UserIdentity`` smart contract address object instance will set as the ``identitySC``. ::

    constructor (address _identitySC) {
            admin = msg.sender;
            identitySC = UserIdentity(_identitySC);
    }


Functions
~~~~~~~~~

applyLoan(...)
^^^^^^^^^^^^^^

Creates a Loan request. ::

    function applyLoan(uint _amount, uint _months, uint _interest, uint _planId, address _borrower) public isBroker()

Parameters: 
    * ``_amount`` - Loan amount
    * ``_months`` - Duration of the loan
    * ``_interest`` - Loan interest
    * ``_planId`` -  Loan plan id
    * ``_borrower`` - Borrower address

Modifiers:
    * ``isBroker`` - Checks the function caller registered as a Broker.

signByBorrower(...)
^^^^^^^^^^^^^^^^^^^

This function is used to sign the Loan by Borrower. ::

    function signByBorrower(uint _loanId) public isLoanBorrower(_loanId) isValidLoan(_loanId) isLoanIn(_loanId, LoanState.INSURANCE_APPROVED)
    
Parameters:
    * ``_loanId`` -  Loan Id

Modifiers:
    * ``isLoanBorrower()`` - The function caller should be the Borrower of the Loan.
    * ``isValidLoan(_loanId)`` - Checks Loan validity
    * ``isLoanIn(_loanId, LoanState.INSURANCE_APPROVED)`` - Checks Loan is in INSURANCE_APPLIED state.

approveLoan(...)
^^^^^^^^^^^^^^^^

This function changes the ``bankApprove`` value to ``True`` and change the Loan state to ``BANK_APPROVED`` state. ::
    
    function approveLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.BORROWER_SIGNED)

Parameters:
    * ``_loanId`` -  Loan Id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Checks Loan validity
    * ``isLoanIn(_loanId, LoanState.BORROWER_SIGNED)`` - Checks Loan is in BORROWER_SIGNED state.

rejectLoan(...)
^^^^^^^^^^^^^^^

This function changes the ``bankApprove`` value to ``False`` and change the Loan state to ``BANK_REJECTED`` state. ::

    function rejectLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.BORROWER_SIGNED)

Parameters:
    * ``_loanId`` -  Loan Id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Checks Loan validity
    * ``isLoanIn(_loanId, LoanState.BORROWER_SIGNED)`` - Checks Loan is in BORROWER_SIGNED state.


confirmTokenTrasferToBroker(...)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
This function changes the Loan state to PAID_TO_BROKER. ::

    function confirmTokenTrasferToBroker(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.BANK_APPROVED)

Parameters:
    * ``_loanId`` -  Loan Id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Checks Loan validity
    * ``isLoanIn(_loanId, LoanState.PAID_TO_INSURANCE)`` - Checks Loan is in PAID_TO_INSURANCE state.

confirmTokenTrasferToBorrower(...)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This function changes the Loan state to ONGOING. ::

    function confirmTokenTrasferToBorrower(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.PAID_TO_BROKER)

Parameters:
    * ``_loanId`` -  Loan Id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Checks Loan validity
    * ``isLoanIn(_loanId, LoanState.PAID_TO_BROKER)`` - Checks Loan is in PAID_TO_BROKER state.

closeLoan(...)
^^^^^^^^^^^^^^ 

This function changes the Loan state to CLOSE. ::

    function closeLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.ONGOING)

Parameters:
    * ``_loanId`` -  Loan Id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Checks Loan validity
    * ``isLoanIn(_loanId, LoanState.ONGOING)`` - Checks Loan is in ONGOING state.

markAsDefaulted(...)
^^^^^^^^^^^^^^^^^^^^

This function changes the Loan state to DEFAULT. ::

    function markAsDefaulted(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.ONGOING)

Parameters:
    * ``_loanId`` -  Loan Id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Checks Loan validity
    * ``isLoanIn(_loanId, LoanState.ONGOING)`` - Checks Loan is in ONGOING state.

viewLoan(...)
^^^^^^^^^^^^^

This function returns the Loan. ::

    function viewLoan(uint _loanId) public view returns(Loan memory loan)

Parameters:
    * ``_loanId`` -  Loan Id

Return:
    * ``Loan`` - Return Loan registered in ``_loanId``.


getLoans()
^^^^^^^^^^^^^

This function returns all the Loans. ::

    function getLoans() public view returns(Loan [] memory)

Return:
    * ``Loan []`` - Return all Loans as an object array.
