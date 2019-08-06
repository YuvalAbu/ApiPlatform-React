import axios from 'axios';

function findAll(){
	return axios
	.get("http://localhost:8000/api/invoices")
	.then((response)=> response.data["hydra:member"])
}

function deleteInvoice(id){
	return axios
		.delete("http://localhost:8000/api/invoices/" + id)
		.then((response)=> console.log("ok"))
}

function find(id) {
	return axios.get("http://localhost:8000/api/invoices/" + id)
	.then((response) => response.data)
}

function create(invoice){
	return axios.post("http://localhost:8000/api/invoices", {...invoice, customer: `/api/customers/${invoice.customer}`})
}

function update(invoice, id){
	return axios.put("http://localhost:8000/api/invoices/" + id , {...invoice, customer: `/api/customers/${invoice.customer}`})
}

export default {
	findAll,
	find,
	update,
	create,
	delete: deleteInvoice
}