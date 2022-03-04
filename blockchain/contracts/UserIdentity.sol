// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract UserIdentity{
    
    enum Role { GUEST, BROKER, BORROWER }
    
    struct User{
        uint id; 
        string socialSecurityId; // each property has an unique social security id
        address walletAddress;
        string name;
        Role role;
    }
    
    address private admin;
    
    uint private brokersCount = 0;
    uint private borrowersCount = 0;
    
    mapping(address => User) private borrowers;
    mapping(address => User) private brokers;
    
    address[] private brokersAddresses;
    address[] private borrowersAddresses;
    
    constructor()
    {
        admin = msg.sender; // Ganache Account 1, the Bank
    }
    
    modifier isAdmin()
    {
        require(admin == msg.sender, 'Admin Only');
        _;
    }
    
    function verifyIsBroker(address _address) public view returns(bool)
    {
        bool isValid = false;
        isValid = brokers[_address].role == Role.BROKER;
        return isValid;
    }
    
    function verifyIsBorrower(address _address) public view returns(bool)
    {
        bool isValid = false;
        isValid = borrowers[_address].role == Role.BORROWER;
        return isValid;
    }

    function addBroker(string memory _socialSecurityId, address _address, string memory _name) 
        public isAdmin()
    {
        brokersCount = brokersCount + 1;
        User memory user = User(brokersCount, _socialSecurityId, _address, _name, Role.BROKER );
        brokers[_address] = user;
        brokersAddresses.push(_address);
    }
    
    function addBorrower(string memory _socialSecurityId, address _address, string memory _name) 
        public isAdmin()
    {
        borrowersCount = borrowersCount + 1;
        User memory user = User(borrowersCount, _socialSecurityId, _address, _name,  Role.BORROWER );
        borrowers[_address] = user;
        borrowersAddresses.push(_address);
    }
    
    function getAllBrokers() public view returns (User[] memory){
        User[] memory ret = new User[](brokersCount);
        for (uint i = 0; i < brokersCount; i++) {
            ret[i] = brokers[brokersAddresses[i]];
        }
        return ret;
    }
    
    function getAllBorrowers() public view returns (User[] memory){
        User[] memory ret = new User[](borrowersCount);
        for (uint i = 0; i < borrowersCount; i++) {
            ret[i] = borrowers[borrowersAddresses[i]];
        }
        return ret;
    }
}
