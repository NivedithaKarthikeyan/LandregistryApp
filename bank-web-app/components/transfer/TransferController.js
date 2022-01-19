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
	const [balance, setBalance] = useState('0.00');
	const [address, setAddress] = useState('');
	const [amount, setAmount] = useState('');
	const [transactionHash, setTransactionHash] = useState('');
	const [isTransactionSuccessful, setIsTransactionSuccessful] = useState(false);
	const { MicroToken } = useContext(AuthContext);

	const [current, setCurrent] = React.useState(0);

	const getBalance = async () => {
		try {
			const accounts = await window.ethereum.enable();
			// console.log(accounts[0]);
			const response = await MicroToken.methods.balanceOf(accounts[0]).call();

			setBalance(response);
		} catch (err) {
			// console.log(err);
			message.error('Error occured while reading balance');
		}
	};

	const transferTokens = () => {
		setCurrent(current + 1);
		console.log(amount);
	};

	const prev = () => {
		setCurrent(current - 1);
	};

	const backToHome = () => {
		setIsTransactionSuccessful(false);
		setCurrent(0);
	};

	const confirmTokenTransfer = async () => {
		try {
			const accounts = await window.ethereum.enable();
			const response = await MicroToken.methods.transfer(address, amount).send({
				from: accounts[0] });

			setTransactionHash(response.transactionHash);
			setIsTransactionSuccessful(true);
			setCurrent(current + 1);
			message.success('Token transferred successfully');
		} catch (err) {
			// console.log(err);
			message.error('Error occured while transferring tokens');
			setCurrent(current + 1);
			setIsTransactionSuccessful(false);
		}
	};

	useEffect(() => {
		getBalance();
	});

	useEffect(() => {
		if (amount !== '') {
			transferTokens();
			console.log('Transfer Tokens executed');
		}
	}, [amount]);

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
			<Title level={4}>Account balance: {balance}</Title>
			<Divider />

			<Row>
				<Col lg={24} xl={18} xxl={16} style={{ marginBottom: 25 }}>
					<Steps current={current}>
						{steps.map(item => (
							<Step key={item.title} title={item.title} icon={item.icon} />
						))}
					</Steps>
				</Col>
			</Row>
			{
				current === 0 &&
				<Row>
					<Col lg={24} xl={18} xxl={16}>
						<TransferForm
							setAddress={setAddress}
							setAmount={setAmount}
							transferTokens={transferTokens}
						/>
					</Col>
				</Row>
			}
			{
				current === 1 &&
				<Row>
					<Col lg={24} xl={18} xxl={16}>
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
				current === 2 && isTransactionSuccessful &&
				<Row>
					<Col lg={24} xl={18} xxl={16}>
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
