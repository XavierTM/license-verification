import store from "./store";


function setAuthenticated(authenticated=true) {
   store.dispatch({
      type: 'SET_AUTHENTICATED',
      payload: { authenticated }
   })
}

const actions = {
   setAuthenticated,
}


export default actions;