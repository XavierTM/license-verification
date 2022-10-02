

function reducer(state, action) {

   const { type, payload } = action;

   switch (type) {

      case 'SET_AUTHENTICATED':
         return { ...state, authenticated: payload.authenticated };

      default:
         return state;
   }
}

export default reducer;