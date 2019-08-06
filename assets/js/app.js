// Imports
import React, {useState}  from 'react';
import ReactDom from 'react-dom';
import {HashRouter, Switch, Route, withRouter} from 'react-router-dom'
import Navbar from './components/navbar';
import HomePage from './pages/HomePage';
import CustomersPage from './pages/CustomersPage';
import CustomerPage from './pages/CustomerPage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/AuthAPI'
import AuthContext from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import InvoicePage from './pages/InvoicePage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

require('../css/app.css');

AuthAPI.setup();

const App = ()=>{

	const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated())	
	const NavbarWithRouter = withRouter(Navbar)

		const ContextValue = {
			isAuthenticated,
			setIsAuthenticated
		}

	return (
		<AuthContext.Provider value={ContextValue}>
			<HashRouter>
				<NavbarWithRouter/>
				<main className="container pt-5">
					<Switch>
						<Route path="/login" component={LoginPage}/>
						<Route path="/register" component={RegisterPage}/>
						<PrivateRoute path="/invoices/:id" component={InvoicePage}/>
						<PrivateRoute path="/invoices" component={InvoicesPage}/>
						<PrivateRoute path="/customers/:id" component={CustomerPage}/>
						<PrivateRoute path="/customers" component={CustomersPage}/>
						<Route path="/" component={HomePage}/>
					</Switch>
				</main>
			</HashRouter>
			<ToastContainer position={toast.POSITION.BOTTOM_LEFT}/>
		</AuthContext.Provider>
	)
}

const rootElement = document.querySelector('#app');
ReactDom.render(<App/>, rootElement)