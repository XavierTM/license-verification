
import React from 'react';



class LazyloadImage extends React.Component {

	onLoad() {
		this.setState({ ...this.state, loaded: true });
	}

	state = {
		loaded: false
	}

	render() {

		const { loaded } = this.state;
		const { src, alt } = this.props;
		const aspectRatio = (this.props.aspectRatio || 1).toString();

		const divStyle = {
			background: loaded ? undefined : '#CCC',
			display: 'block',
			aspectRatio
		}

		const imgStyle = {
			display: loaded ? '' : 'none',
			width: '100%',
			aspectRatio
		}

		const onLoad = this.onLoad.bind(this);


		return <div style={divStyle}>
			<img style={imgStyle} src={src} onLoad={onLoad} alt={alt} />
		</div>
	}
}

export default LazyloadImage;