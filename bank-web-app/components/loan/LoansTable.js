import React, { useState, useContext, useEffect } from 'react';
import { Table, Tag, Card, Divider, message, Modal, Form } from 'antd';
import AuthContext from '../../stores/authContext';
import { getApi } from '../../util/fetchApi';

function LoansTable() {
	const { user, BankLoan, UserIdentity } = useContext(AuthContext);

	const state = ['REQUESTED', 'BORROWER_SIGNED', 'BANK_APPROVED', 'BANK_REJECTED',
		'PAID_TO_BROKER', 'ONGOING', 'DEFAULT', 'CLOSE'];

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
	const [id, setId] = useState(-1);

	const [payments, setPayments] = useState([]);

	const [componentSize, setComponentSize] = useState('default');

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
		const response = await UserIdentity.methods.getAllBrokers().call();
		for (let i = 0; i < response.length; i++) {
			brokers[response[i].userAddress] = response[i].name;
		}
	};

	const getBorrowers = async () => {
		const response = await UserIdentity.methods.getAllBorrowers().call();
		for (let i = 0; i < response.length; i++) {
			borrowers[response[i].userAddress] = response[i].name;
		}
	};

	const getLoans = async () => {
		try {
			const response = await BankLoan.methods.getLoans().call();

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

	const approveLoan = async () => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoan.methods.approveLoan(id).send({ from: accounts[0] });
			message.success(`Loan ${id} approved`);
			getLoans();
		} catch (err) {
			message.error('Error occured while approving the Loan');
		}
	};

	const rejectLoan = async () => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoan.methods.rejectLoan(id).send({ from: accounts[0] });
			message.success(`Loan ${id} rejected`);
			getLoans();
		} catch (err) {
			message.error('Error occured while rejecting the Loan');
		}
	};

	const signLoan = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoan.methods.signByBorrower(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} signed`);
			getLoans();
		} catch (err) {
			console.log(err);
			message.error('Error occured while signing Loan');
		}
	};

	const confirmTokenTrasferToBroker = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoan.methods.confirmTokenTrasferToBroker(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
			getLoans();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const confirmTokenTrasferToBorrower = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoan.methods.confirmTokenTrasferToBorrower(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
			getLoans();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const closeLoan = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoan.methods.closeLoan(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
			getLoans();
		} catch (err) {
			console.log(err);
			message.error('Error occured while updating Loan');
		}
	};

	const markAsDefaulted = async (loanId) => {
		try {
			const accounts = await window.ethereum.enable();
			await BankLoan.methods.markAsDefaulted(loanId).send({ from: accounts[0] });
			message.success(`Loan ${id} updated`);
			getLoans();
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
							<a href="javascript:void(0);" onClick={() => confirmTokenTrasferToBroker(record.id)}>
								Confirm Broker Payment
							</a>
						</span>;
				} else if (record.status === '4') {
					actionBlock =
						<span>
							<a href="javascript:void(0);" onClick={() => confirmTokenTrasferToBorrower(record.id)}>
								Token Transferred to Borrower
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

	const loanData = async () => {
		await getBrokers();
		await getBorrowers();
		await getPayments();
		await getLoans();
	};

	useEffect(() => {
		loanData();
		const emitter = BankLoan.events.loanRequest({ fromBlock: 'latest' }, (error, response) => {
			const result = response.returnValues;

			const row = {
				key: result.id,
				id: result.id,
				amount: result.amount,
				period: result.months,
				interest: result.interest,
				planId: result.planId,
				borrower: result.borrower,
				broker: result.broker,
				status: result.state,
			};

			// console.log(row)

			setData((prev) => {
				return [...prev, row];
			});
		});

		return () => {
			emitter.unsubscribe();
		};
	}, []);

	const expandedRowRender = (record) => {
		console.log(record);

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
				<p>Confirm?</p>
			</Modal>
			<Modal title={`Reject Loan Request ${id}`} visible={isRejectModalVisible} onOk={handleReject} onCancel={handleCancel}>
				<p>Reject loan request?</p>
			</Modal>
		</>
	);
}

export default LoansTable;
