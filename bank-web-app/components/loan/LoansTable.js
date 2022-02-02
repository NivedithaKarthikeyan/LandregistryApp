import React, { useState, useContext, useEffect } from 'react';
import { Table, Tag, Card, Divider, message, Modal, Form, Space, Button } from 'antd';
import AuthContext from '../../stores/authContext';
import { getApi } from '../../util/fetchApi';

function LoansTable() {
	// Following properties will captured from authContext.
	// user - selected user role form the top right corner of the bank web app.
	// Smart contract instances - Micro Token, Bank Loan and User Identity.
	const { user, MicroTokenContract, BankLoanContract, UserIdentityContract } = useContext(AuthContext);

	// Define Bank Loan states.
	// These states should be in order as defined in the Bank Loan smart contract.
	const state = ['REQUESTED', 'BORROWER_SIGNED', 'BANK_APPROVED', 'BANK_REJECTED',
		'PAID_TO_BROKER', 'ONGOING', 'DEFAULT', 'CLOSE'];

	const [isModalVisible, setIsModalVisible] = useState(false); // Loan approve confirmation modal visibility state.
	const [isRejectModalVisible, setIsRejectModalVisible] = useState(false); // Loan remove modal visibility state.
	const [isBrokerTransferModalVisible, setIsBrokerTransferModalVisible] = useState(false);
	const [isBorrowerTransferModalVisible, setIsBorrowerTransferModalVisible] = useState(false);
	const [id, setId] = useState(-1);
	const [loanRecord, setLoanRecord] = useState({});
	const [current, setCurrent] = useState(0);

	const [payments, setPayments] = useState([]);

	const [componentSize] = useState('default');

	const [data, setData] = useState([]);

	const brokers = {};
	const borrowers = {};

	const getPayments = async () => {
		try {
			const response = await getApi({
				url: 'loan-payments',
			});
			const paymentsResult = await response;
			setPayments(paymentsResult);
		} catch (err) {
			console.log(err);
			message.error('Error occured while loading Loan Payments');
		}
	};

	const getBrokers = async () => {
		const response = await UserIdentityContract.methods.getAllBrokers().call();
		for (let i = 0; i < response.length; i++) {
			brokers[response[i].userAddress] = response[i].name;
		}
	};

	const getBorrowers = async () => {
		const response = await UserIdentityContract.methods.getAllBorrowers().call();
		for (let i = 0; i < response.length; i++) {
			borrowers[response[i].userAddress] = response[i].name;
		}
	};

	const getLoans = async () => {
		try {
			const response = await BankLoanContract.methods.getLoans().call();

			setData([]);

			for (let i = 0; i < response.length; i++) {
				const row = {
					key: response[i].id,
					id: response[i].id,
					amount: response[i].amount,
					period: response[i].months,
					interest: response[i].interest,
					planId: response[i].planId,
					borrowerName: borrowers[response[i].borrower],
					borrower: response[i].borrower,
					brokerFee: response[i].brokerFee,
					brokerName: brokers[response[i].broker],
					broker: response[i].broker,
					status: response[i].state,
				};

				setData((prev) => {
					return [...prev, row];
				});
			}
		} catch (err) {
			console.log(err);
			message.error('Error occured while loading current Loans');
		}
	};

	const loadData = async () => {
		await getBrokers();
		await getBorrowers();
		await getPayments();
		await getLoans();
	};

	const confirmTokenTrasferToBroker = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.confirmTokenTrasferToBroker(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const transferTokensToBroker = async () => {
		try {
			const accounts = await window.ethereum.enable();
			await MicroTokenContract.methods.transfer(loanRecord.broker, loanRecord.brokerFee).send({
				from: accounts[0] });
			message.success('Token transferred successfully');
			await setCurrent(1);
			await confirmTokenTrasferToBroker(loanRecord.id);
			await setCurrent(0);
			await setIsBrokerTransferModalVisible(false);
		} catch (err) {
			console.log(err);
			await setCurrent(0);
			message.error('Error occured while transferring tokens');
		}
	};

	const confirmTokenTrasferToBorrower = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.confirmTokenTrasferToBorrower(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const transferTokensToBorrower = async () => {
		try {
			const accounts = await window.ethereum.enable();
			await MicroTokenContract.methods.transfer(loanRecord.borrower, loanRecord.amount).send({
				from: accounts[0] });
			message.success('Token transferred successfully');
			await setCurrent(1);
			await confirmTokenTrasferToBorrower(loanRecord.id);
			await setCurrent(0);
			await setIsBorrowerTransferModalVisible(false);
		} catch (err) {
			console.log(err);
			await setCurrent(0);
			message.error('Error occured while transferring tokens');
		}
	};

	const approveLoan = async () => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.approveLoan(id).send({ from: accounts[0] });
			message.success(`Loan ${id} approved`);
			loadData();
		} catch (err) {
			message.error('Error occured while approving the Loan');
		}
	};

	const rejectLoan = async () => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.rejectLoan(id).send({ from: accounts[0] });
			message.success(`Loan ${id} rejected`);
			loadData();
		} catch (err) {
			message.error('Error occured while rejecting the Loan');
		}
	};

	const signLoan = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.signByBorrower(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} signed`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while signing Loan');
		}
	};

	const closeLoan = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.closeLoan(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const markAsDefaulted = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoanContract.methods.markAsDefaulted(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
			loadData();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const showModal = (value) => {
		setId(value);
		setIsModalVisible(true);
	};

	const showRejectModal = (value) => {
		setId(value);
		setIsRejectModalVisible(true);
	};

	const showBrokerTransferModal = (row) => {
		setLoanRecord(row);
		setIsBrokerTransferModalVisible(true);
	};

	const showBorrowerTransferModal = (row) => {
		setLoanRecord(row);
		setIsBorrowerTransferModalVisible(true);
	};

	const handleOk = () => {
		approveLoan();
		setIsModalVisible(false);
	};

	const handleReject = () => {
		rejectLoan();
		setIsRejectModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setIsRejectModalVisible(false);
		setIsBrokerTransferModalVisible(false);
		setIsBorrowerTransferModalVisible(false);
	};

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			render: text => text,
		},
		{
			title: 'Borrower Name',
			dataIndex: 'borrowerName',
			key: 'borrowerName',
		},
		{
			title: 'Broker Name',
			dataIndex: 'brokerName',
			key: 'brokerName',
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
		},
		{
			title: 'Period',
			dataIndex: 'period',
			key: 'period',
		},
		{
			title: 'Interest %',
			key: 'interest',
			dataIndex: 'interest',
		},
		{
			title: 'Broker Fee',
			key: 'brokerFee',
			dataIndex: 'brokerFee',
		},
		{
			title: 'Plan ID',
			key: 'planId',
			dataIndex: 'planId',
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			render: tag => {
				let color = 'geekblue';
				if (tag === '3' || tag === '6') {
					color = 'red';
				} else if (tag === '2' || tag === '5') {
					color = 'green';
				}
				return (
					<Tag color={color} key={tag}>
						{state[tag]}
					</Tag>
				);
			},
		},
	];

	if (user.role === 'bank') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			key: 'x',
			render: (record) => {
				let actionBlock = '';
				if (record.status === '1') {
					actionBlock =
						<span>
							<a href="javascript:void(0);" onClick={() => showModal(record.id)}>Approve</a>
							<Divider type="vertical" />
							<a href="javascript:;" onClick={() => showRejectModal(record.id)} style={{ color: 'red' }}>Reject</a>
						</span>;
				} else if (record.status === '2') {
					actionBlock =
						<span>
							<a href="javascript:void(0);" onClick={() => showBrokerTransferModal(record)}>
								Transfer Tokens to Broker
							</a>
						</span>;
				} else if (record.status === '4') {
					actionBlock =
						<span>
							<a href="javascript:void(0);" onClick={() => showBorrowerTransferModal(record)}>
								Transfer Tokens to Borrower
							</a>
						</span>;
				} else if (record.status === '5') {
					actionBlock =
						<span>
							<a href="javascript:void(0);" onClick={() => closeLoan(record.id)}>Close</a>
							<Divider type="vertical" />
							<a href="javascript:;" onClick={() => markAsDefaulted(record.id)} style={{ color: 'red' }}>Defaulted</a>
						</span>;
				}
				return actionBlock;
			},
		});
	}

	if (user.role === 'borrower') {
		columns.push({
			title: 'Action',
			dataIndex: '',
			key: 'x',
			render: (record) => {
				if (record.status === '0') {
					return (
						<span>
							<a href="javascript:void(0);" onClick={() => signLoan(record.id)}>Sign Loan</a>
						</span>
					);
				}
			},
		});
	}

	useEffect(() => {
		loadData();
		const emitter = BankLoanContract.events.loanRequest({ fromBlock: 'latest' }, (error, response) => {
			const result = response.returnValues;

			const row = {
				key: result.id,
				id: result.id,
				amount: result.amount,
				period: result.months,
				interest: result.interest,
				planId: result.planId,
				borrower: result.borrower,
				brokerFee: result.brokerFee,
				broker: result.broker,
				status: result.state,
			};

			setData((prev) => {
				return [...prev, row];
			});
		});

		return () => {
			emitter.unsubscribe();
		};
	}, []);

	const expandedRowRender = (record) => {
		const expandedData = [];

		expandedData.push(record);

		const expandedPayments = payments.filter(item => item.loanId == record.id);

		const expandedPaymentColumns = [
			{ title: 'Payment ID', dataIndex: '_id', key: 'id' },
			{ title: 'Amount', dataIndex: 'amount', key: 'amount' },
			{ title: 'Loan ID', dataIndex: 'loanId', key: 'loanId' },
			{ title: 'Transaction Hash', dataIndex: 'transactionHash', key: 'transactionHash' },
		];

		return (
			<>
				<Form
					labelCol={{
						lg: 6,
						xl: 6,
						xxl: 3,
					}}
					wrapperCol={{
						lg: 12,
						xl: 12,
						xxl: 16,
					}}
					layout="horizontal"
					initialValues={{
						size: componentSize,
					}}
					size={componentSize}
					labelAlign="left"
				>
					<Form.Item label="Borrower address">
						<span>{record.borrower}</span>
					</Form.Item>
					<Form.Item label="Broker address">
						<span>{record.broker}</span>
					</Form.Item>
				</Form>
				<Table
					columns={expandedPaymentColumns}
					dataSource={expandedPayments}
					pagination={false}
				/>
			</>
		);
	};

	return (
		<>
			<Card title="Current Loans">
				<Table
					pagination="true"
					columns={columns}
					dataSource={data}
					expandable={{
						expandedRowRender,
					}}
				/>
			</Card>
			<Modal title={`Approve Loan Request ${id}`} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
				<p>Are you sure to approve loan?</p>
			</Modal>
			<Modal title={`Reject Loan Request ${id}`} visible={isRejectModalVisible} onOk={handleReject} onCancel={handleCancel}>
				<p>Reject loan request?</p>
			</Modal>
			<Modal
				title={`Transfer Tokens to Broker - Loan Id ${loanRecord.id}`}
				visible={isBrokerTransferModalVisible}
				width={700}
				onCancel={handleCancel}
				footer={null}
			>
				{
					current === 0 &&
					<Form
						labelCol={{
							lg: 4,
							xl: 3,
							xxl: 3,
						}}
						wrapperCol={{
							lg: 20,
							xl: 20,
							xxl: 20,
						}}
						layout="horizontal"
						initialValues={{
							size: componentSize,
						}}
						size={componentSize}
						labelAlign="left"
					>
						<Form.Item label="Broker">
							<span> { loanRecord.broker } </span>
						</Form.Item>
						<Form.Item label="Amount">
							<span> { loanRecord.brokerFee } </span>
						</Form.Item>
						<Form.Item wrapperCol={{
							lg: { span: 14, offset: 4 },
							xl: { span: 14, offset: 3 },
							xxl: { span: 14, offset: 3 } }}
						>
							<Space direction="horizontal">
								<Button type="primary" onClick={() => transferTokensToBroker()}>Confirm transfer</Button>
							</Space>
						</Form.Item>
					</Form>
				}
				{
					current === 1 &&
					<span>Update the Loan</span>
				}
			</Modal>
			<Modal
				title={`Transfer Tokens to Borrower - Loan Id ${loanRecord.id}`}
				visible={isBorrowerTransferModalVisible}
				width={700}
				onCancel={handleCancel}
				footer={null}
			>
				{
					current === 0 &&
					<Form
						labelCol={{
							lg: 4,
							xl: 3,
							xxl: 3,
						}}
						wrapperCol={{
							lg: 20,
							xl: 20,
							xxl: 20,
						}}
						layout="horizontal"
						initialValues={{
							size: componentSize,
						}}
						size={componentSize}
						labelAlign="left"
					>
						<Form.Item label="Borrower">
							<span> { loanRecord.borrower } </span>
						</Form.Item>
						<Form.Item label="Amount">
							<span> { loanRecord.amount } </span>
						</Form.Item>
						<Form.Item wrapperCol={{
							lg: { span: 14, offset: 4 },
							xl: { span: 14, offset: 3 },
							xxl: { span: 14, offset: 3 } }}
						>
							<Space direction="horizontal">
								<Button type="primary" onClick={() => transferTokensToBorrower()}>Confirm transfer</Button>
							</Space>
						</Form.Item>
					</Form>
				}
				{
					current === 1 &&
					<span>Update the Loan</span>
				}
			</Modal>
		</>
	);
}

export default LoansTable;
