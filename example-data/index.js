const { ethers } = require("ethers");
const UserIdentityBuild = require('./build_contracts/UserIdentity.json')

const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545")

const getAccounts = async () => {
    const accounts = await provider.listAccounts();
    return accounts;
}

const contract = new ethers.Contract(UserIdentityBuild.networks[5777].address, UserIdentityBuild.abi, provider);

const addBorrower = async () => {
    const accounts = await getAccounts();
    const signer = await provider.getSigner()
    console.log(await signer.getAddress());
    const contractSigner = await contract.connect(signer);
    contractSigner.addBorrower("3455", accounts[2], 'Borrower 1');
}

const addBroker = async () => {
    const accounts = await getAccounts();
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(UserIdentityBuild.networks[5777].address, UserIdentityBuild.abi, provider);
    const contractSigner = await contract.connect(signer);
    await contractSigner.addBroker("2345", accounts[1], 'Broker 1');
}

const run = async () => {
    try{
        await addBroker();
        await addBorrower();
        // setTimeout(() => {
            
        // }, 10000);
    } catch (err){
        console.log(err);
    }
}

run();




