import React, { useEffect, useState, useContext } from 'react';
import { Typography, Card, Divider, message, Steps, Col, Row } from 'antd';
import { FileTextOutlined, FileDoneOutlined, AuditOutlined } from '@ant-design/icons';
import AuthContext from '../../stores/authContext';
import TransferForm from './TransferForm';
import TransactionSuccess from './TransactionSuccess';
import TransactionConfirm from './TransactionConfirm';
import TransactionFail from './TransactionFail';

const { Title } = Typography;
const { Step } = Steps;

function TransferController() {
	const [balance, setBalance] = useState('0'); // token balance state
	const [address, setAddress] = useState(''); // user wallet address state
	const [amount, setAmount] = useState(''); // transferring token amount state
	const [transactionHash, setTransactionHash] = useState(''); // blockchain transaction state
	const [isTransactionSuccessful, setIsTransactionSuccessful] = useState(false); // transaction successfull state
	const { MicroTokenContract } = useContext(AuthContext); // get the Micro Token Contract object from authContext defined in the 'stores/authContext.js'

	// stages of token transferring process
	// 	0. fill token transfering formatCountdown
	// 	1. confirm receiver address and amount
	// 	2. transaction result (successful or not)
	const [current, setCurrent] = useState(0); // current stage of token transferring process

	// read the user token balance from the Micro Token Contract
	const getBalance = async () => {
		try {
			const accounts = await window.ethereum.enable(); // get selected wallet account from the metamask plugin.
			// read token balance from the Micro Token Smart Contract for the selected wallet address.
			const response = await MicroTokenContract.methods.balanceOf(accounts[0]).call();

			setBalance(response); // update the balance state
		} catch (err) {
			console.log(err);
			message.error('Error occured while reading balance'); // show error message if any error occured while reading the token balance
		}
	};

	const transferTokens = () => {
		setCurrent(current + 1); // increase the token transfering process stage.
	};

	const prev = () => {
		setCurrent(current - 1); // decrease the token transfering process stage.
	};

	const backToHome = () => {
		// set stages and successful states to default values.
		setIsTransactionSuccessful(false);
		setCurrent(0);
	};

	// transfer tokens from selected wallet account to receiver account
	const confirmTokenTransfer = async () => {
		try {
			const accounts = await window.ethereum.enable(); // get selected wallet account from the metamask plugin.
			// transfer tokens using Micro Token Smart Contract.
			// parameters: address - receiver wallet address, amount - amount of tokens
			const response = await MicroTokenContract.methods.transfer(address, amount).send({
				from: accounts[0] });

			setTransactionHash(response.transactionHash); // update the transaction hash state from the response
			setIsTransactionSuccessful(true); // update transaction result state as successful.
			setCurrent(current + 1); // update the transfer stage.
			message.success('Token transferred successfully');
		} catch (err) {
			// if error occured while transferring tokens;
			console.log(err);
			message.error('Error occured while transferring tokens');
			setCurrent(current + 1); // update the transfer statge.
			setIsTransactionSuccessful(false); // update transaction result state as unsuccessful.
		}
	};

	useEffect(() => {
		getBalance(); // load the wallet token balance when load the web page.
	}, []);

	useEffect(() => {
		if (amount !== '') {
			transferTokens(); // if amount state value is not empty transferTokens function will execute.
		}
	}, [amount]); // This useEffect function will execute when amount state value change.

	// Three steps of token transferring process
	const steps = [
		{
			title: 'Transfer details',
			icon: <FileTextOutlined />,
		},
		{
			title: 'Transfer confirm',
			icon: <FileDoneOutlined />,
		},
		{
			title: 'Transfer results',
			icon: <AuditOutlined />,
		},
	];

	return (
		<Card
			title="Transfer Micro Tokens"
			extra={<a href="javascript:void(0);" onClick={() => getBalance()}>Refresh Balance</a>}
		>
			{/* This will show the balance state value in the web page */}
			<Title level={4}>Account balance: {balance}</Title> 
			<Divider />

			<Row>
				<Col lg={24} xl={18} xxl={16} style={{ marginBottom: 25 }}>
					{/* Steps will show in the line and update when current state value updated.
					For more details please refer Step component in AntDesign */}
					<Steps current={current}>
						{steps.map(item => (
							<Step key={item.title} title={item.title} icon={item.icon} />
						))}
					</Steps>
				</Col>
			</Row>
			{
				// if user in the first stage of the token transfering process, web page will show the transfer form
				current === 0 &&
				<Row>
					<Col lg={24} xl={18} xxl={16}>
						{/* This will load the TransferForm component in the web page */}
						<TransferForm
							setAddress={setAddress} // pass setAddress method as setAddress property to the TrnsferForm Component.
							setAmount={setAmount} // pass setAmount method as setAmount propert to the TransferForm Component.
						/>
					</Col>
				</Row>
			}
			{
				// if user submit the transfer details(receiver address and token amount) web page will ask for the confirmation.
				current === 1 &&
				<Row>
					<Col lg={24} xl={18} xxl={16}>
						{/* This will load the transaction confirmation in the web page */}
						<TransactionConfirm
							address={address}
							amount={amount}
							transactionHash={transactionHash}
							confirmTokenTransfer={confirmTokenTransfer}
							prev={prev}
						/>
					</Col>
				</Row>
			}
			{
				// when user confirm the details it will transfer the tokens and update the transaction results.
				// if transaction process in the results stage and transaction successful it will show the successful message on the web page.
				current === 2 && isTransactionSuccessful &&
				<Row>
					<Col lg={24} xl={18} xxl={16}>
						{/* show the transaction successful message with the transaction details and transactionHash value */}
						<TransactionSuccess
							amount={amount}
							address={address}
							transactionHash={transactionHash}
							backToHome={backToHome}
						/>
					</Col>
				</Row>
			}
			{
				// if transaction process in the results stage and transaction failed it will show the transaction fail message on the web page.
				current === 2 && !isTransactionSuccessful &&
				<Row>
					<Col lg={24} xl={18} xxl={16}>
						<TransactionFail
							backToHome={backToHome}
						/>
					</Col>
				</Row>
			}
		</Card>

	);
}

export default TransferController;
