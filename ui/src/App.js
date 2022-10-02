
import './App.css';
import AppWrapper, { Route } from '@xavisoft/app-wrapper';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Lookup from './pages/Lookup';
import { Provider } from 'react-redux'
import store from './store';
import ErrorBoundary from './components/ErrorBoundary';


// dimensions
function setDimensions() {

	const height = window.innerHeight + 'px';
	const width = window.innerHeight + 'px';

	document.documentElement.style.setProperty('--window-height', height);
	document.documentElement.style.setProperty('--window-width', width);

}

window.addEventListener('resize', setDimensions);
setDimensions();


function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppWrapper router="hash">

          <Navbar />

          <Route path="/" component={Login} />
          <Route path="/lookup" component={Lookup} />

        </AppWrapper>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
