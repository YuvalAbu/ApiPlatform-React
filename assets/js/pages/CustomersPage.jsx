import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from '../services/CustomersAPI';
import {Link} from 'react-router-dom';
import TableLoader from '../components/loaders/TableLoader'
import {toast} from 'react-toastify';

const CustomersPage = (props) => {

	const [customers, setCustomers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true)

	// Permet de récupérer les customers
	const fetchCustomers = async () =>{
		try {
			const data = await CustomersAPI.findAll()
			setCustomers(data)
			setLoading(false)
		} catch (error) {
			toast.error("Une erreur est survenue lors de la récupération des cutomers!");		
		}
	}

	// au chargement du composant, on va chercher les customers
	useEffect(()=> {
		fetchCustomers()
	}, [])

	// Gestion de la suppression d'un customers
	const handleDelete = async (id) => {

		const originalCustomers = [...customers]

		setCustomers(customers.filter(customers=> customers.id !== id))

		try {
			await CustomersAPI.delete(id)
			toast.success("Le client a bien été supprimé!");		
		} catch (error) {
			setCustomers(originalCustomers)
			toast.error("Une erreur est survenue !");		
		}
		
	}

	// gestion du chargement de la page
	const handlePageChange = (page) => setCurrentPage(page)

	// Gestion de la recherche
	const handleSearch = (event) => {
		const value = event.currentTarget.value;
		setSearch(value);
		setCurrentPage(1);
	}

	const itemsPerPage = 10;

	// filtrage des customers en fonction de la recherche
	const filtredCustomers = customers.filter(
		c => 
		c.firstName.toLowerCase().includes(search.toLowerCase()) || 
		c.lastName.toLowerCase().includes(search.toLowerCase()) ||
		c.email.toLowerCase().includes(search.toLowerCase()) ||
		(c.company && c.company.toLowerCase().includes(search.toLowerCase()))
		)

	// pagination des données
	const paginatedCustomers = Pagination.getData(
		filtredCustomers, 
		currentPage, 
		itemsPerPage
	)
	

	return ( 
		<>
			<div className="mb-3 d-flex justify-content-between align-items-center">
				<h1>Liste des Cliens</h1> 
				<Link to="/customers/new" className="btn btn-primary">Créer un customer</Link>
			</div>	

			<div className="form-group">
				<input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
			</div>

			<table className="table table-hover">
				<thead>
					<tr>
						<th>Id.</th>
						<th>Client</th>
						<th>Email</th>
						<th>Entreprise</th>
						<th className="text-center">Factures</th>
						<th className="text-center">Montant total</th>
						<th></th>
					</tr>
				</thead>
				
				{!loading && ( 
				<tbody>
					{paginatedCustomers.map(customer => (
						<tr key={customer.id}>
						<td>{customer.id}</td>
						<td>
							<Link to={"/customers/" + customer.id}>{customer.firstName} {customer.lastName}</Link>
						</td>
						<td>{customer.email}</td>
						<td>{customer.company}</td>
						<td className="text-center">
							<span className="badge badge-primary">{customer.invoices.length}</span>
						</td>
						<td className="text-center">
							{customer.totalAmount.toLocaleString()} €
						</td>
						<td>
							<button 
							onClick={()=> handleDelete(customer.id)}
							disabled={customer.invoices.length > 0}
							className="btn btn-sm btn-danger"
							>
								Supprimer
							</button>
						</td>
					</tr>
					))}
				</tbody>
				)}
			</table>
			
			{loading && (<TableLoader/>)}

      {itemsPerPage < filtredCustomers.length && (
				<Pagination 
					currentPage={currentPage} 
					itemsPerPage={itemsPerPage} 
					length={filtredCustomers.length} 
					onPageChanged={handlePageChange} 
				/>
			)}
		</>
	);
}
 
export default CustomersPage;