
import reducer from './reducer';
import { createStore } from 'redux';

const defaultState = {
   authenticated: false,
}


const store = createStore(reducer, defaultState);

export default store;