import React, {useState, useEffect} from 'react'
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import {Link} from 'react-router-dom';
import CustomersAPI from '../services/CustomersAPI' 
import InvoicesAPI from '../services/InvoicesAPI';

const InvoicePage = ({history, match}) => {

	const {id = "new"} = match.params

	const [editing, setEditing] = useState(false)

	const [invoice, setInvoice] = useState({
		amount: "",
		customer: "",
		status: "SENT"
	})

	const [errors, setErrors] = useState({
		amount: "",
		customer: "",
		status: ""
	})

	const [customers, setCustomers] = useState([])

	const fectCustomer = async () => {
		try {
			const data =  await CustomersAPI.findAll();
			setCustomers(data)
						
			if (!invoice.customer) setInvoice({...invoice, customer: data[0].id})
		}catch (error) {
			console.log(error.response);
			history.replace("/invoices")
		}
	}

	const fetchInvoice = async id => {
		try {
			const {amount, status, customer} = await InvoicesAPI.find(id)
			setInvoice({amount, status, customer : customer.id})
			
		} catch (error) {
			console.log(error.response);
			history.replace("/invoices")
		}
	}

	useEffect(()=>{
		fectCustomer()
	}, [])

	useEffect(()=>{
		if (id !== "new") {
			setEditing(true)
			fetchInvoice(id)
		}
	}, [id])

	const handleChange = ({currentTarget}) => {
		const {name, value} = currentTarget
		setInvoice({...invoice, [name]: value})
	}

	const handleSubmit = async event => {
		event.preventDefault();
		console.log(invoice);
		try {
			if (editing) {
				await InvoicesAPI.update(invoice, id)
			}else{
				await InvoicesAPI.create(invoice)
				history.replace("/invoices")
			}
			
		}catch({response}){
			const {violations} = response.data
			if(violations){
				const apiErrors = {};
				violations.map(({propertyPath, message}) => {
					apiErrors[propertyPath] = message
				})
				setErrors(apiErrors);
				
			}
		}
		
	}
	
	return ( 
		<>
			{!editing && <h1>Création d'une facture</h1> || <h1>Modification d'une facture</h1>}


			<form onSubmit={handleSubmit}>
				<Field
					name="amount"
					type="number"
					placeholder="Montant de la facture"
					label="Montant"
					onChange={handleChange}
					value={invoice.amount}
					error={errors.amount}
				/>
				<Select
					name="customer"
					label="Client"
					onChange={handleChange}					
					value={invoice.customer}
					error={errors.customer}
				>
					{customers.map(customer => (
						<option key={customer.id} value={customer.id}>
							{customer.firstName} {customer.lastName}
						</option>
					))}
				</Select>
				<Select
					name="status"
					label="Statut"
					onChange={handleChange}					
					value={invoice.status}
					error={errors.status}
				>
					<option value="SENT">Envoyée</option>
					<option value="PAID">Payée</option>
					<option value="CANCELLED">Annulée</option>
				</Select>

				<div className="form-group">
					<button type="submit" className="btn btn-success">Enregistrer</button>
					<Link to="/invoices" className="btn btn-link">Retour au factures</Link>
				</div>
			</form>
		</>
	 );
}
 
export default InvoicePage;