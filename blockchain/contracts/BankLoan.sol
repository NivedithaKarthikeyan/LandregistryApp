// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./UserIdentity.sol";

contract BankLoan{
    
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
        uint brokerFee;
        bool bankApprove;
        bool isBorrowerSigned;
    }
    
    event loanRequest(
        uint id,
        uint amount,
        uint months,
        uint interest,
        string planId,
        LoanState state,
        address broker,
        address borrower,
        uint brokerFee,
        bool bankApprove,
        bool isBorrowerSigned
    );
    
    address private admin;
    UserIdentity identitySC;
    Loan[] private loans;
    
    constructor (address _identitySC) {
        admin = msg.sender; // Ganache Account 1, the Bank
        identitySC = UserIdentity(_identitySC);
    }
    
    modifier isAdmin()
    {
        require(msg.sender == admin);
        _;
    }
    
    modifier isBroker()
    {
        require(identitySC.verifyIsBroker(msg.sender), 'Broker Only');
        _;
    }

    modifier isLoanBorrower(uint _loanId){
        bool isValid = false;
        for(uint i=0; i< loans.length; i++)
        {
            if(loans[i].id == _loanId && loans[i].borrower == msg.sender)
            {
                isValid = true;
                break;
            }
        }
        require(isValid);
        _;
    }
    
    modifier isValidLoan(uint _loanId)
    {
        bool isValid = false;
        for(uint i=0; i< loans.length; i++)
        {
            if(loans[i].id == _loanId)
            {
                isValid = true;
                break;
            }
        }
        require(isValid);
        _;
    }
    
    modifier isLoanIn(uint _loanId, LoanState _state)
    {
        bool isValid = false;
        for(uint i=0; i< loans.length; i++)
        {
            if(loans[i].id == _loanId && loans[i].state == _state)
            {
                isValid = true;
                break;
            }
        }
        require(isValid);
        _;
    }

    function applyLoan(uint _amount, uint _months, uint _interest, string memory _planId, address _borrower, uint _brokerFee) 
        public isBroker()
    {
        Loan memory l = Loan(loans.length + 1, _amount, _months, _interest, _planId, LoanState.REQUESTED, msg.sender,
        _borrower, _brokerFee, false, false);
        
        loans.push(l);
        
        emit loanRequest(l.id, l.amount, l.months, l.interest, l.planId,
            l.state, l.broker, l.borrower, l.brokerFee, l.bankApprove, l.isBorrowerSigned );
    }
    
    function signByBorrower(uint _loanId) public isLoanBorrower(_loanId) isValidLoan(_loanId) isLoanIn(_loanId, LoanState.REQUESTED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].isBorrowerSigned = true;
                loans[i].state = LoanState.BORROWER_SIGNED;
                break;
            }
        }
    }
    
    
    function approveLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.BORROWER_SIGNED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].bankApprove = true;
                loans[i].state = LoanState.BANK_APPROVED;
                break;
            }
        }
    }
    
    function rejectLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.BORROWER_SIGNED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].bankApprove = false;
                loans[i].state = LoanState.BANK_REJECTED;
                break;
            }
        }
    }
    
    function confirmTokenTrasferToBroker(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.BANK_APPROVED)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.PAID_TO_BROKER;
                break;
            }
        }
    }
    
    
    function confirmTokenTrasferToBorrower(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.PAID_TO_BROKER)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.ONGOING;
                break;
            }
        }
    }
    
    function closeLoan(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.ONGOING)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.CLOSE;
                break;
            }
        }
    }
    
    function markAsDefaulted(uint _loanId) public isAdmin() isValidLoan(_loanId) isLoanIn(_loanId, LoanState.ONGOING)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                loans[i].state = LoanState.DEFAULT;
                break;
            }
        }
    }

    function viewLoan(uint _loanId) public view returns(Loan memory loan)
    {
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].id == _loanId) {
                return (loans[i]);
            }
        }
    }
    
    function getLoans() public view returns(Loan [] memory)
    {
        return loans;
    }  
}
