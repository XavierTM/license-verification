

import Component from '@xavisoft/react-component';


class Page extends Component {


	_render() {
		return <h4>Please implement <code>_render</code></h4>
	}

	render() {
		return <div className="page">
			{this._render()}
		</div>
	}
}


export default Page;