import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/InvoicesAPI';
import moment from 'moment';
import {Link} from 'react-router-dom';
import TableLoader from '../components/loaders/TableLoader'


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
	const [loading, setLoading] = useState(true)



	const fetchInvoices = async () => {
		try {
			const data = await InvoicesAPI.findAll()
			setInvoices(data)
			setLoading(false)
		} catch (error) {
			console.log(error.response);
			toast.error("Une erreur est survenue lors du chargement des factuures !");		

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
			toast.success("La facture à bien été supprimer !");		
		} catch (error) {
			setInvoices(originalInvoices)
			toast.error("Une erreur est survenue !");		
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
			<div className="mb-3 d-flex justify-content-between align-items-center">
				<h1>Liste des factures</h1>
				<Link to="/invoices/new" className="btn btn-primary">Créer une facture</Link>
			</div>	

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

				{!loading && (
				<tbody>
					{paginatedInvoices.map(invoice => (						
						<tr key={invoice.id}>
							<td className="text-center">{invoice.chrono}</td>
							<td>
								<Link to={"/customers/" + invoice.customer.id}>{invoice.customer.firstName} {invoice.customer.lastName}</Link>
							</td>
							<td className="text-center">{formatDate(invoice.sentAt)}</td>
							<td className="text-center">
								<span className={"badge badge-" + STATUTS_CLASSES[invoice.status]}>{STATUTS_LABEL[invoice.status]}</span>
							</td>
							<td className="text-center">{invoice.amount.toLocaleString()} €</td>
							<td>
								<Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
								<button className="btn btn-sm btn-danger" onClick={()=> handleDelete(invoice.id)}>Supprimer</button>
							</td>
						</tr>
					))}
				</tbody>
				)}
			</table>

			{loading && (<TableLoader/>)}
			
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