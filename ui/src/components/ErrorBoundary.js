
import React from 'react';

class ErrorBoundary extends React.Component {

   state = {
      hasError: false,
      message: ''
   }

   // getDerivedStateFromError(err) {
   //    return {
   //       hasError: true,
   //       message: err.message
   //    }
   // }

   componentDidCatch(err) {
      this.setState({
         hasError: true,
         message: err.message
      });
   }

   render() {
      if (!this.state.hasError)
         return this.props.children;

      return <div
         style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
         }}
      >
         <div style={{
            textAlign: 'center',
            width: 300,
            fontFamily: 'Helvetica, Arial',
            color: 'grey'
         }}>
            <h3>Something went wrong</h3>
            {this.state.message}
         </div>
      </div>
   }
}


export default ErrorBoundary;