
import './App.css';
import AppWrapper, { Route } from '@xavisoft/app-wrapper'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';


function setDimensions() {
	const height = window.innerHeight + 'px';
	const width = window.innerWidth + 'px';

	document.documentElement.style.setProperty('--window-height', height);
	document.documentElement.style.setProperty('--window-width', width);
}

window.addEventListener('resize', setDimensions);
setDimensions();


function App() {
	return (
		<AppWrapper>

			<Navbar />

			<Route path="/" component={Login} />
			<Route path="/dashboard" component={Dashboard} />
		</AppWrapper>
	);
}

export default App;
