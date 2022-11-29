
import Component from '@xavisoft/react-component';

class Page extends Component {

   _render() {
      return <div>
         <h1>Please implement <code>_render()</code></h1>
      </div>
   }

   render() {
      return <div className='page'>
         {this._render()}
      </div>
   }
}

export default Page;