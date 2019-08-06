import React, { useEffect, useState } from 'react';
import Field from '../components/forms/Field';
import {Link} from 'react-router-dom';
import CustomersAPI from '../services/CustomersAPI' 
import FormContentLoader from '../components/loaders/FormContentLoader'


const CustomerPage = ({match, history}) => {

	const {id = "new" } = match.params;

	const [customer, setCustomer] = useState({
		firstName: "",
		lastName: "",
		email: "",
		company: ""
	})

	const [errors, setErrors] = useState({
		firstName: "",
		lastName: "",
		email: ""
	})

	const [editing, setEditing] = useState(false)
	const [loading, setLoading] = useState(false)


	const fectCustomer = async (id) => {
		try {
		
			const {firstName, lastName, email, company} = await CustomersAPI.find(id);
			setCustomer({firstName, lastName, email, company})
			setLoading(false)
		}catch (error) {
			toast.error("Une erreur est survenue lors de la récupération des cutomers!");		
			history.replace("/customers")			
		}
	}

	useEffect(()=>{
		if (id !== "new") {
			setEditing(true)
			setLoading(true)
			fectCustomer(id)	
		}
	}, [id])

	const handleChange = ({currentTarget}) => {
		const {name, value} = currentTarget
		//On peut faire aussi const {name, value} = currentTarget;

		setCustomer({...customer, [name]: value})
		
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			if (editing) {
				await CustomersAPI.update(customer, id)
				toast.success("Le client a bien été modifié !");		
				setErrors({})
			}else{
				await CustomersAPI.create(customer)
				setErrors({})
				toast.success("Le client a bien été crée !");		
				history.replace("/customers")
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
			toast.error("Une erreur est survenue !");		
		}
		
	}

	return (
		<>
			{!editing && <h1>Création d'un client</h1> || <h1>Modification d'un client</h1>}

			{loading && (<FormContentLoader/>)}

			{!loading && (
			<form onSubmit={handleSubmit}>
				<Field
					name="lastName"
					label="Nom de famille"
					placeholder="Nom de famille du client"
					value={customer.lastName}
					onChange={handleChange}
					error={errors.lastName}
				/>
				<Field
					name="firstName"
					label="Prénom"
					placeholder="Prénom du client"
					value={customer.firstName}
					onChange={handleChange}
					error={errors.firstName}
				/>
				<Field
					name="email"
					label="Adresse email"
					placeholder="Adresse email du client"
					value={customer.email}
					onChange={handleChange}
					error={errors.email}
				/>
				<Field
					name="company"
					label="Entreprise"
					placeholder="Entreprise du client"
					value={customer.company}
					onChange={handleChange}
				/>
				<div className="form-group">
					<button type="submit" className="btn btn-success">Enregistrer</button>
					<Link to="/customers" className="btn btn-link">Retour à la liste</Link>
				</div>
			</form>
			)}
		</>
	)
}
 
export default CustomerPage;