import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/invoicesApi';
import moment from 'moment';

const STATUTS_CLASSES = {
	PAID: 'success',
	SENT: 'primary',
	CANCELLED: 'danger'
}

const STATUTS_LABEL = {
	PAID: 'Payée',
	SENT: 'Envoyée',
	CANCELLED: 'Annulée'
}

const InvoicesPage = (props) => {

	const [invoices, setInvoices] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");
	const itemsPerPage = 10;


	const fetchInvoices = async () => {
		try {
			const data = await InvoicesAPI.findAll()
			setInvoices(data)

		} catch (error) {
			console.log(error.response);
		}
	}

	useEffect(()=>{
		fetchInvoices()
	},[])

	const formatDate = (str) => moment(str).format('DD/MM/YYYY')

	// gestion du chargement de la page
	const handlePageChange = (page) => setCurrentPage(page)

	// Gestion de la suppression d'un customers
	const handleDelete = async (id) => {

		const originalInvoices = [...invoices]

		setInvoices(invoices.filter(invoices=> invoices.id !== id))

		try {
			await InvoicesAPI.delete(id)
		} catch (error) {
			setInvoices(originalInvoices)
		}
		
	}

	// Gestion de la recherche
	const handleSearch = (event) => {
		const value = event.currentTarget.value;
		setSearch(value);
		setCurrentPage(1);
	}

	// filtrage des customers en fonction de la recherche
	const filtredInvoices = invoices.filter(
		i => 
		i.customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
		i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
		i.amount.toString().toLowerCase().startsWith(search.toLowerCase()) ||
		STATUTS_LABEL[i.status].toLowerCase().includes(search.toLowerCase())
		)

	// pagination des données
	const paginatedInvoices = Pagination.getData(
		filtredInvoices, 
		currentPage, 
		itemsPerPage
	)

	return ( 
		<>
			<h1>Liste des factures</h1>

			<div className="form-group">
				<input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
			</div>

			<table className="table table-hover">
				<thead>
					<tr>
						<th className="text-center">Numéro</th>
						<th>Client</th>
						<th className="text-center">Date d'envoie</th>
						<th className="text-center">Statut</th>
						<th className="text-center">Montant</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{paginatedInvoices.map(invoice => (						
						<tr key={invoice.id}>
							<td className="text-center">{invoice.chrono}</td>
							<td>
								<a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
							</td>
							<td className="text-center">{formatDate(invoice.sentAt)}</td>
							<td className="text-center">
								<span className={"badge badge-" + STATUTS_CLASSES[invoice.status]}>{STATUTS_LABEL[invoice.status]}</span>
							</td>
							<td className="text-center">{invoice.amount.toLocaleString()} €</td>
							<td>
								<button className="btn btn-sm btn-primary mr-1">Editer</button>
								<button className="btn btn-sm btn-danger" onClick={()=> handleDelete(invoice.id)}>Supprimer</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Pagination 
					currentPage={currentPage} 
					itemsPerPage={itemsPerPage} 
					length={filtredInvoices.length} 
					onPageChanged={handlePageChange} 
				/>
		</>
	 );
}
 
export default InvoicesPage;