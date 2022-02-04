import React, { useState, useContext, useEffect } from 'react';
import { Table, Form, InputNumber, Card, Divider, Modal, Button, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { getApi, patchApi, deleteApi } from '../../util/fetchApi';
import UserContext from '../../stores/userContext';

function PlansTable({ togglePlan }) {
	const { user } = useContext(UserContext); // Access the use role selected from userContext.
	const [componentSize, setComponentSize] = useState('default');
	const [isModalVisible, setIsModalVisible] = useState(false); // Edit Loan Plan Modal visibility state.
	const [data, setData] = useState([]); // Stores Loan Plan data.

	const onFormLayoutChange = ({ size }) => {
		setComponentSize(size);
	};

	const { confirm } = Modal;

	const [id, setId] = useState(''); // Loan id state.
	const [minAmount, setMinAmount] = useState(''); // Minimum amount of the loan
	const [maxAmount, setMaxAmount] = useState(''); // Maximum amount of the loan
	const [minMonths, setMinMonths] = useState(''); // Minimum duration of the loan in months.
	const [maxMonths, setMaxMonths] = useState(''); // Maximum duration of the loan in months.
	const [interest, setInterest] = useState(''); // Loan interest.

	// Get all loan plans from the bank server.
	const fetchPlans = async () => {
		try {

			// Calls http get method to fetch all loan plans from the bank server.
			const response = await getApi({
				url: 'loan-plans', // Calls <Bank Server URL>/loan-plans api.
			});

			const plans = await response; // Get Loan Plans from the bank server response.
			setData([]); // Initialize data array to zero elements to add all Loan Plans from the bank server response.
			// Add all Loan Plans to the data array.
			for (let i = 0; i < plans.length; i++) {
				const row = {
					key: plans[i]._id,
					id: plans[i]._id,
					minAmount: plans[i].minAmount,
					maxAmount: plans[i].maxAmount,
					minMonths: plans[i].minMonths,
					maxMonths: plans[i].maxMonths,
					interest: plans[i].interest,
				};

				setData((prev) => {
					// Spread operator(...) helps to update the states.
					// Append each Loan Plan to the data array.
					return [...prev, row]; 
				});
			}
		} catch (err) {
			console.log(err);
			message.error('Error occured while loading Loan Plans');
		}
	};

	// Get Loan Plan by id from bank server.
	const fetchPlanById = async (planId) => {
		try {
			const response = await getApi({
				// Calls the <Bank Serrver URL>/loan-plans api with planId as a parameter.
				// Complete URL => <Bank Server URL>/loan-plans/planId
				url: 'loan-plans/' + planId, 
			});

			// Get the Loan Plan from bank server http response and update react component states.
			const plan = await response;
			setId(plan._id);
			setMinAmount(plan.minAmount);
			setMaxAmount(plan.maxAmount);
			setMinMonths(plan.minMonths);
			setMaxMonths(plan.maxMonths);
			setInterest(plan.interest);
		} catch (err) {
			console.log(err);
			message.error('Error occured while loading Loan Plan');
		}
	};

	// Display Loan Plan edit modal.
	// Parameter - planId = Loan Plan Id
	const showModal = (planId) => {
		fetchPlanById(planId); // First fetch the Loan Plan details by its id from the bank server.
		setIsModalVisible(true); // Change Loan Plan edit modal visibility to true.
	};

	// Delete Loan Plan.
	// Parameter - planId = Loan Plan Id
	const deletePlan = (planId) => {
		confirm({
			icon: <CloseCircleOutlined style={{ color: 'red' }} />,
			content: `Delete Loan Plan ${planId}`,
			onOk: async () => {
				try {
					// Calls <Bank Server URL>/loan-plans DELETE HTTP method.
					// Complete URL => <Bank Server URL>/loan-plans/planId
					const response = await deleteApi({
						url: 'loan-plans/' + planId,
					});
					if (response.status === 200) {
						await message.success('Sucsessfully delete the loan plan');
						fetchPlans(); // Fetch all plans after successfully delete a Loan Plan.
					} else {
						message.error('Error occured while deleting loan plan');
					}
				} catch (err) {
					console.log(err);
					message.error('Error occured while deleting loan plan');
				}
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	};

	// Loan Plan table columns. Each object in the columns array contains:
	// title : Title of the column.
	// dataIndex : Property name of the data object that should display in the column.
	// key : Key of the data object. This should be unique.
	// render : Defined how data should be displayed in the table cell.
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			render: text => text,
		},
		{
			title: 'Min Amount',
			dataIndex: 'minAmount',
			key: 'minAmount',
		},
		{
			title: 'Max Amount',
			dataIndex: 'maxAmount',
			key: 'maxAmount',
		},
		{
			title: 'Minimum Period',
			dataIndex: 'minMonths',
			key: 'minMonths',
			render: text => text + ' months',
		},
		{
			title: 'Maximum Period',
			dataIndex: 'maxMonths',
			key: 'maxMonths',
			render: text => text + ' months',
		},
		{
			title: 'Interest %',
			key: 'interest',
			dataIndex: 'interest',
		},
	];

	// if Bank user it will append Action column to the table.
	if (user.role === 'bank') {
		columns.push({
			title: 'Action',
			dataIndex: '', // Not specify the Data property. Data object will use in render method.
			key: 'x',
			render: (record) => (
				// Data object passed as record parameter.
				<span>
					{/* Pass loan plan id to the showModal and deletePlan methods. */}
					<a href="javascript:void(0);" onClick={() => showModal(record.id)}>Edit</a>
					<Divider type="vertical" />
					<a href="javascript:void(0);" onClick={() => deletePlan(record.id)} style={{ color: 'red' }}>Delete</a>
				</span>
			),
		});
	}

	// Edit Loan Plan modal ok button handler.
	const handleOk = async () => {
		setIsModalVisible(false); // Chnange modal visibility state.

		try {
			// Define HTTP request body object
			const body = {
				minAmount,
				maxAmount,
				minMonths,
				maxMonths,
				interest,
			};

			// Convert body object to a json object.
			const requestOptions = {
				body: JSON.stringify(body),
			};

			// Use HTTP PATCH method to update the Loan Plan.
			const response = await patchApi({
				// Send HTTP Patch request to <Bank Server URL>/loan-plans/planId api.
				url: 'loan-plans/' + id,
				options: requestOptions,
			});

			message.success('Loan Plan updated successfully');
			fetchPlans(); // Fetch all Loan Plans from the bank server when successfully update a Loan Plan.
		} catch (err) {
			message.error('Error while updating the Loan Plan');
			console.log(err);
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false); // Dismiss the Loan Plan edit Modal.
	};

	useEffect(() => {
		fetchPlans();
	}, []); // Execute fetchPlans function when load the PlansTable component.

	useEffect(() => {
		fetchPlans();
	}, [togglePlan]); // Execute fetchPlans function when togglePlan state changes.

	return (
		<>
			<Card
				title="Loan Plans"
				extra={<a href="javascript:void(0);" onClick={() => fetchPlans()}>Refresh</a>}
			>
				{/* Ant design table component. */}
				<Table columns={columns} dataSource={data} />
			</Card>
			
			{/* Loan Plan edit modal */}
			<Modal
				title="Edit Loan Plan"
				visible={isModalVisible} //Change the visibility according to isModalVisibility state.
				onCancel={handleCancel} // Function to be executed when user clicks the Cancel button of the modal.
				// Defines the footer of the modal.
				footer={[
					<Button key="back" onClick={handleCancel}>
						Cancel
					</Button>,
					<Button key="submit" type="primary" onClick={handleOk}>
						Save Changes
					</Button>,
				]}
			>
				{/* Form input fields values set using states defined in the value property
				Update states when user changes the input field values */}
				<Form
					labelCol={{
						span: 5,
					}}
					wrapperCol={{
						span: 18,
					}}
					layout="horizontal"
					initialValues={{
						size: componentSize,
					}}
					onValuesChange={onFormLayoutChange}
					size={componentSize}
				>
					<Form.Item label="Id">
						<span className="ant-form-text">{id}</span>
					</Form.Item>
					<Form.Item label="Min amount">
						<InputNumber
							min="0"
							style={{ width: '100%' }}
							placeholder="Enter amount"
							value={minAmount} // Field value set from the minAmount state.
							onChange={(e) => setMinAmount(e)} // When user chnage the field value it will update the minAmount state.
						/>
					</Form.Item>
					<Form.Item label="Max amount">
						<InputNumber
							min="0"
							style={{ width: '100%' }}
							placeholder="Enter amount"
							value={maxAmount}
							onChange={(e) => setMaxAmount(e)}
						/>
					</Form.Item>
					<Form.Item label="Min months">
						<InputNumber
							min="0"
							style={{ width: '100%' }}
							placeholder="Enter deal period"
							value={minMonths}
							onChange={(e) => setMinMonths(e)}
						/>
					</Form.Item>
					<Form.Item label="Max months">
						<InputNumber
							min="0"
							style={{ width: '100%' }}
							placeholder="Enter deal period"
							value={maxMonths}
							onChange={(e) => setMaxMonths(e)}
						/>
					</Form.Item>
					<Form.Item label="Interest">
						<InputNumber
							min="0"
							style={{ width: '100%' }}
							placeholder="Enter interes rate"
							value={interest}
							onChange={(e) => setInterest(e)}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}

export default PlansTable;
