const UserIdentity = artifacts.require("UserIdentity");
const BankLoan = artifacts.require("BankLoan");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(UserIdentity);
  const userIdentityInstance = await UserIdentity.deployed();

  console.log(userIdentityInstance.address);

  await deployer.deploy(BankLoan, userIdentityInstance.address);
};