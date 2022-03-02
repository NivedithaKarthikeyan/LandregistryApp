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


1. Micro Token Smart Contract - MicroToken.sol
----------------------------------------------

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

Return the ``__totalSupply`` of Tokens.  It is a public function: ::

    function totalSupply() public pure override returns (uint _totalSupply) { 
        _totalSupply = __totalSupply;
    }

balanceOf
^^^^^^^^^

Return token balance of a given account. An account address should be passed as a parameter to this function.  It is a public function: ::

    function balanceOf(address _addr) public view override returns (uint balance) {
        return __balanceOf[_addr];
    }

transfer
^^^^^^^^

Transfer tokens from one account to another.  Tokens are transferred from the caller's (``msg.sender``) account. ``_to`` is the receiving account and ``_value `` is the token amount. 
This function returns true if transfer is successful and false otherwise. ::

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

Transfer tokens from one account to another via a third-party account. 
Token owner is the ``_from`` parameter; the receiver's account is ``_to`` parameter.  The function caller is the spender. Token amount is the ``_value`` parameter.
Note the various conditions it checks before performing the transfer.
It returns ``true`` if successful or ``false`` otherwise. ::

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

An owner may grant permission to a spender to transfer tokens from his account. The transfer is materialized by the ``transferFrom`` function above.
To grant permission, the owner should ``approve`` the ``_spender``'s account address  and the token ``_value``.
This function returns ``true`` if it is successful. ::

    function approve(address _spender, uint _value) public override returns (bool success) {
        __allowances[msg.sender][_spender] = _value;
        return true;
    }

allowance
^^^^^^^^^

It informs the amount of tokens the ``_owner`` has granted the ``_spender`` to spend. ::

    function allowance(address _owner, address _spender) public view override returns (uint remaining) {
            return __allowances[_owner][_spender];
    }



2. User Identity Smart contract - UserIdentity.sol
--------------------------------------------------

This contract holds User details. It registers  Broker and Borrower details.

enum
~~~~

We capture different roles of users in the system using enum.  Currently there are 3 user roles in the system. ::

    enum Role { GUEST, BROKER, BORROWER }

struct
~~~~~~~

User - This struct holds user attributes. ::

    struct User{
        uint id; 
        string socialSecurityId; // each property has an unique social security id
        address userAddress;
        string name;
        Role role;
        bool isBankApproved;
    }

* ``id`` - System assigned id for the user. This is an incremental number.
* ``socialSecurityId`` - Social security number.
* ``userAddress`` - User wallet account address (from Ganache or other blockchain).
* ``name`` - User name.
* ``role`` - User role (BROKER, BORROWER).
* ``isBankApproved`` - Whether Bank ratifies the user.

Modifiers
~~~~~~~~~

The following modifiers are used in the ``UserIdentity.sol`` functions.

* ``isAdmin()`` - Check whether function caller is the admin (creator and deployer) of the contract.

Attributes
~~~~~~~~~~

``UserIdentity.sol`` has the following attributes. 

* ``admin`` - Deployer account address of the smart contract. 
* ``brokersCount`` - Total number of brokers in the system. 
* ``borrowersCount`` - Total number of borrowers in the system.
    
* ``borrowers`` - List of Borrowers in the system (address-to-Borrower mapping).
* ``brokers`` - List of Brokers in the system (address-to-User mapping).
    
* ``brokersAddresses`` - List of Broker addresses (dynamic array).
* ``borrowersAddresses`` - List of Borrower addresses (dynamic array).

Constructor
~~~~~~~~~~~

The constructor designates the contract deployer (``msg.sender``) as the admin. ::

    constructor()
    {
        admin = msg.sender;
    }


Functions
~~~~~~~~~

addBroker
^^^^^^^^^

Add new Broker account to the system: ::

    function addBroker(string memory _socialSecurityId, address _address, string memory _name) 
        public isAdmin()

Parameters:
    * ``_socialSecurityId`` - Social Security ID of Broker.
    * ``_address`` - Wallet account address of Broker.
    * ``_name`` - Broker's name.

Modifiers:
    * ``isAdmin()`` - Check whether function caller is the admin of the smart contract instance.

addBorrower
^^^^^^^^^^^

Add new Borrower account to the system: ::

    function addBorrower(string memory _socialSecurityId, address _address, string memory _name) 
        public isAdmin()

Parameters:
    * ``_socialSecurityId`` - Social Security ID of  Broker.
    * ``_address`` - Wallet account address of  Borrower.
    * ``_name`` - Borrower's name.

Modifiers:
    * ``isAdmin()`` - Check whether function caller is the sdmin of the smart contract instance.

verifyIsBroker
^^^^^^^^^^^^^^

Verify whether the given account address is a Broker account or not. ::

    function verifyIsBroker(address _address) public view returns(bool)

Parameters:
    * ``_address`` - Account address of user.

This function is used by other smart contracts to verify a Broker account. 
It returns ``true`` if the broker exists on the given address or ``false`` otherwise.

verifyIsBorrower
^^^^^^^^^^^^^^^^^

Verify whether the given account address is a Borrower account or not. ::

    function verifyIsBorrower(address _address) public view returns(bool)

Parameters:
    * ``_address`` - Account address of user.

This function is used by other smart contracts to verify a Borrower account. 
It returns ``true`` if the Borrower exists on the given address or ``false`` otherwise.

getAllBrokers
^^^^^^^^^^^^^

Return all the Brokers as an array. ::

    function getAllBrokers() public view returns (User[] memory)

Return: 
    * ``User []`` - List of Brokers as an array.

getAllBorrowers
^^^^^^^^^^^^^^^

Return all the Borrowers as an array. ::

    function getAllBorrowers() public view returns (User[] memory)

Return: 
    * ``User []`` - List of Borrowers as an array.


3. Bank Loan Smart Contract - BankLoan.sol
------------------------------------------

This smart contract stores Bank Loan details.  The Bank is the owner of this smart contract.

State Transition Diagram of The Bank Loan
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following diagram shows the state transition of a Bank Loan.
We use this state transition diagram to implement Bank Loan state changes in the ``BankLoan`` smart contract.

.. image:: ../images/state_transition_bank_loan.png

enum
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

* ``REQUESTED`` - Initial state of a loan. Broker requests a loan on behalf of a Borrower. 
* ``BORROWER_SIGNED`` - Borrower agrees to the Loan. 
* ``BANK_APPROVED`` - Bank approves the Loan
* ``BANK_REJECTED`` - Bank rejects the Loan
* ``PAID_TO_BROKER`` - Bank gives fee to Broker.
* ``ONGOING`` - Bank transfers tokens to the Borrower's account. 
* ``DEFAULT`` - Borrower is unable to pay back the Loan. 
* ``CLOSE`` - Borrower paid back the Loan.


struct
~~~~~~~

1. Loan - This structure holds Loan attributes. ::

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

* ``id`` - Loan Id.
* ``amount`` - Loan amount.
* ``months`` - Loan duration in months.
* ``interest`` - Loan interest.
* ``planId`` - Loan plan Id.
* ``state`` - Current state of the loan.
* ``broker`` - Address of the Broker who applied the Loan.
* ``borrower`` - Address of the Borrower of the Loan.
* ``bankApprove`` - Status of the Bank approval for the Loan.
* ``isBorrowerSigned`` - Borrower Signed status.

Event
~~~~~~

This event is defined in the ``BankLoan`` smart contract.

loanRequest
^^^^^^^^^^^

This event is emitted when a Broker creates a loan request. ::

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
    * ``id`` -  Loan Id.
    * ``amount`` - Loan amount.
    * ``months`` - Duration of the loan.
    * ``interest`` - Loan interest.
    * ``planId`` - Loan plan Id.
    * ``state`` - Current state of the loan.
    * ``broker`` - Broker of the loan.
    * ``borrower`` - Borrower address of the loan.
    * ``bankApprove`` - Bank approval status.
    * ``isBorrowerSigned`` - Borrower signed status.


Modifiers
~~~~~~~~~

The following modifiers are used in the ``BankLoan.sol`` functions.

* ``isAdmin()`` - Check whether function caller is the owner of the smart contract.
* ``isBroker()`` - Check whether function caller is registered as a Broker in the system.
* ``isLoanBorrower(uint _loanId)`` - Check whether function caller is the Borrower of a given Loan.
* ``isValidLoan(uint _loanId)`` - Check whether Loan exist in the system.
* ``isLoanIn(uint _loanId, LoanState _state)`` - Check whether given Loan is in specific Loan State.


Attributes
~~~~~~~~~~

* ``UserIdentity: identitySC`` -  Stores UserIdentity smart contract object.
* ``address: admin`` - Store smart contract deployer’s address.
* ``Loan[]: loans`` - Stores loan data.

Constructor
~~~~~~~~~~~

The constructor designates the contract deployer's (``msg.sender``) address as the admin address. 
It requires the ``UserIdentity`` smart contract address to deploy the smart contract. Hence, this must be deployed first.
The ``UserIdentity`` smart contract address object instance will be set as the ``identitySC``. ::

    constructor (address _identitySC) {
        admin = msg.sender;
        identitySC = UserIdentity(_identitySC);
    }


Functions
~~~~~~~~~

applyLoan(...)
^^^^^^^^^^^^^^

Create a Loan request. ::

    function applyLoan(uint _amount, uint _months, uint _interest, string memory _planId, 
        address _borrower, uint _brokerFee) public isBroker()

Parameters: 
    * ``_amount`` - Loan amount.
    * ``_months`` - Duration of the Loan.
    * ``_interest`` - Loan interest.
    * ``_planId`` -  Loan plan id.
    * ``_borrower`` - Borrower address.
    * ``__brokerFee`` - Commission for the Broker.

Modifiers:
    * ``isBroker`` - Check whether function caller is registered as a Broker.

signByBorrower(...)
^^^^^^^^^^^^^^^^^^^

Borrower signs Loan requested by Broker for him/herself: ::

    function signByBorrower(uint _loanId) public isLoanBorrower(_loanId) isValidLoan(_loanId) 
        isLoanIn(_loanId, LoanState.REQUESTED)
    
Parameters:
    * ``_loanId`` -  Loan id

Modifiers:
    * ``isLoanBorrower()`` - The function caller should be the Borrower of the Loan.
    * ``isValidLoan(_loanId)`` - Check Loan's validity.
    * ``isLoanIn(_loanId, LoanState.REQUESTED)`` - Check whether Loan is in REQUESTED state.

approveLoan(...)
^^^^^^^^^^^^^^^^

Change the ``bankApprove`` value to ``True`` and changes the Loan state to ``BANK_APPROVED`` state. ::
    
    function approveLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) 
        isLoanIn(_loanId, LoanState.BORROWER_SIGNED)

Parameters:
    * ``_loanId`` -  Loan id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Check Loan's validity.
    * ``isLoanIn(_loanId, LoanState.BORROWER_SIGNED)`` - Check whether Loan is in BORROWER_SIGNED state.

rejectLoan(...)
^^^^^^^^^^^^^^^

Change the ``bankApprove`` value to ``False`` and changes the Loan state to ``BANK_REJECTED`` state. ::

    function rejectLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) 
        isLoanIn(_loanId, LoanState.BORROWER_SIGNED)

Parameters:
    * ``_loanId`` -  Loan id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Check Loan's validity.
    * ``isLoanIn(_loanId, LoanState.BORROWER_SIGNED)`` - Check whether Loan is in BORROWER_SIGNED state.

confirmTokenTrasferToBroker(...)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Change the Loan state to PAID_TO_BROKER. ::

    function confirmTokenTrasferToBroker(uint _loanId) public isAdmin() 
        isValidLoan(_loanId) isLoanIn(_loanId, LoanState.BANK_APPROVED)

Parameters:
    * ``_loanId`` -  Loan id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Check Loan's validity.
    * ``isLoanIn(_loanId, LoanState.PAID_TO_INSURANCE)`` - Check whether Loan is in PAID_TO_INSURANCE state.

confirmTokenTrasferToBorrower(...)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Change the Loan state to ONGOING. ::

    function confirmTokenTrasferToBorrower(uint _loanId) public isAdmin() 
        isValidLoan(_loanId) isLoanIn(_loanId, LoanState.PAID_TO_BROKER)

Parameters:
    * ``_loanId`` -  Loan id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Check Loan's validity
    * ``isLoanIn(_loanId, LoanState.PAID_TO_BROKER)`` - Check whether Loan is in PAID_TO_BROKER state.

closeLoan(...)
^^^^^^^^^^^^^^ 

Change the Loan state to CLOSE. ::

    function closeLoan(uint _loanId) public isAdmin() 
        isValidLoan(_loanId) isLoanIn(_loanId, LoanState.ONGOING)

Parameters:
    * ``_loanId`` -  Loan id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Check Loan's validity.
    * ``isLoanIn(_loanId, LoanState.ONGOING)`` - Check whether Loan is in ONGOING state.

markAsDefaulted(...)
^^^^^^^^^^^^^^^^^^^^

Change the Loan state to DEFAULT. ::

    function markAsDefaulted(uint _loanId) public isAdmin() 
        isValidLoan(_loanId) isLoanIn(_loanId, LoanState.ONGOING)

Parameters:
    * ``_loanId`` -  Loan id

Modifiers:
    * ``isAdmin()`` - The function caller should be the Bank.
    * ``isValidLoan(_loanId)`` - Check Loan's validity
    * ``isLoanIn(_loanId, LoanState.ONGOING)`` - Check whether Loan is in ONGOING state.

viewLoan(...)
^^^^^^^^^^^^^

This function returns the Loan. ::

    function viewLoan(uint _loanId) public view returns(Loan memory loan)

Parameters:
    * ``_loanId`` -  Loan id

Return:
    * ``Loan`` - Return Loan registered as ``_loanId``.


getLoans()
^^^^^^^^^^^^^

This function returns all the Loans as an array. ::

    function getLoans() public view returns(Loan [] memory)

Return:
    * ``Loan []`` - All Loans as an object array.
