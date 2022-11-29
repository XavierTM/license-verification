

import React, { Component } from 'react';

// components
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
// import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
// import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
// import ArrowLeft from '@mui/icons-material/ArrowLeft';
// import ArrowRight from '@mui/icons-material/ArrowRight';
import CameraAlt from '@mui/icons-material/CameraAlt';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import Camera from '@mui/icons-material/Camera';
import Publish from '@mui/icons-material/Publish';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import WebCam from '../Webcam';
const uuid = require('uuid').v4;

// styles
const inputStyle = {
	display: 'none'
}

const divStyle = {
	borderStyle: 'ridge',
	borderWidth: '1px',
	borderColor: 'grey',
	margin: 0,
	padding: 0,
}

const imgStyle = {
	display: 'none'
}

const divControlPanelStyle = {
	display: 'flex',
	alignItems: 'center',
	borderTopStyle: 'ridge',
	borderWidth: '1px',
	borderColor: 'grey',
	margin: 0,
	padding: '7px'
}

const canvasStyle = {
	margin: 0,
	padding: 0
}

// variables
let webcam;
const dragStartCoordinates = { x: 0, y: 0 };

// component definition

class CropImage extends Component {

	id = uuid();
	videoId = uuid();
	audioId = uuid();

	static zoomStep = 0.1;

	static getDataURL(file) {

		const reader = new FileReader();

		return new Promise(resolve => {

			reader.onload = function() {
				resolve(reader.result);
			}

			reader.readAsDataURL(file);

		});
	}

	setImageURL(data) {

		const img = this.getElem('img');
	
		return new Promise(resolve => {
			img.onload = resolve;
			img.src = data;
		});

	}

	getElem(tag) {

		const id = this.props.id || this.id;
		const div = document.getElementById(id);

		if (tag === 'div')
			return div;

		return div.querySelector(tag);

	}

	cropImage() {

		const img = this.getElem('img');

		if (!img.src)
			return;

		// const { naturalWidth, naturalHeight } = img; 

		const canvas = this.getElem('canvas');
		const ctx = canvas.getContext('2d');

		const { zoomFactor=1, x=0, y=0, aspectRatio, canvasWidth } = this.state;

		const dx = 0, dy = 0; 
		const dWidth = canvasWidth, dHeight = canvasWidth / aspectRatio; // ar = w / h; h = w/ar
		const sx = x, sy = y;
		const sWidth = dWidth / zoomFactor, sHeight = dHeight / zoomFactor;

		ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		this.getElem('div').value = canvas.toDataURL('image/jpg').replace(/^data:.+;base64,/, '');
		
	}


	async getImageData(arg) {

		let data;

		if (typeof arg === 'string') {
			data = arg;
		} else {
			const fileInput = arg.target;
			const file = fileInput.files[0];

			if (!file)
				return;

			data = await CropImage.getDataURL(file);
		}

		await this.setImageURL(data);

		// calculating minimum zoomFactor
		const img = this.getElem('img');
		const { naturalHeight, naturalWidth } = img;
		const { canvasWidth } = this.state;

		let aspectRatio;
		if (this.props.aspectRatio === undefined)
			aspectRatio = naturalWidth / naturalHeight;
		else
			aspectRatio = this.state.aspectRatio;		

		const canvasHeight = canvasWidth / aspectRatio;

		let minZoomFactor;
		const xImageWindowRatio = naturalWidth / canvasWidth;
		const yImageWindowRatio = naturalHeight / canvasHeight;

		if (xImageWindowRatio > yImageWindowRatio)
			minZoomFactor = canvasHeight / naturalHeight;
		else
			minZoomFactor = canvasWidth / naturalWidth;

		const zoomFactor = minZoomFactor;
		const x = 0, y = 0;
		await this._setState({ zoomFactor, minZoomFactor, naturalWidth, naturalHeight, x, y, aspectRatio });

		this.cropImage();
	}

	async updateZoomFactor(sign) {
		let { zoomFactor, minZoomFactor } = this.state;
		const { zoomStep } = CropImage;

		zoomFactor += sign * zoomStep;

		if (zoomFactor < minZoomFactor)
			return;

		await this._setState({ zoomFactor });
		await this.cropImage();

	}

	async zoomIn() {
		await this.updateZoomFactor(1);
	}

	async zoomOut() {
		await this.updateZoomFactor(-1);
	}

	async drag(drxnVector) {

		let { x=0, y=0, naturalWidth, naturalHeight, zoomFactor, canvasWidth, aspectRatio } = this.state;
		// const { dragStep } = CropImage;

		x = x + drxnVector.x;
		y = y + drxnVector.y;

		// xy limits
		const canvasHeight = canvasWidth / aspectRatio;
		const canvasZoomedProjectionWidth = canvasWidth / zoomFactor;
		const canvasZoomedProjectionHeight = canvasHeight / zoomFactor;
		const xLimit = naturalWidth - canvasZoomedProjectionWidth;
		const yLimit = naturalHeight - canvasZoomedProjectionHeight;

		if (x < 0) x = 0;
		if (y < 0) y = 0;
		if (x > xLimit) x = xLimit;
		if (y > yLimit) y = yLimit;

		await this._setState({ x, y });
		await this.cropImage();

	}

	async canvasOnPointerUp() {
		const canvas = this.getElem('canvas');
		canvas.onpointermove = null;
		canvas.style.cursor = 'default';
	}

	async canvasOnPointerDown(event) {
		event = event.nativeEvent;
		dragStartCoordinates.x = event.offsetX;
		dragStartCoordinates.y = event.offsetY;

		const canvas = this.getElem('canvas');
		canvas.onpointermove = this.dragWithPointer.bind(this);
		canvas.style.cursor = 'move';

	}

	async dragWithPointer(event) {
		
		const x = event.offsetX;
		const y = event.offsetY;

		const delX = dragStartCoordinates.x - x;
		const delY = dragStartCoordinates.y - y;

		await this.drag({ x: delX, y: delY });
	}

	openFileDialog() {
		const fileInput = this.getElem('input');
		fileInput.click();
	}

	async updateWindowDimensions() {

		try {
			const winWidth = window.innerWidth;
			const winHeight = window.innerHeight;

			let orientation;

			if (winWidth === winHeight)
				orientation = null;
			else if (winWidth > winHeight)
				orientation = 'landscape';
			else
				orientation = 'portrait';

			await this._setState({ orientation, winWidth, winHeight });

		} catch (err) {
			
		}
	}

	updateCanvasDimensions() {
		// setting canvas dimensions
		const canvas = this.getElem('canvas');
		const { canvasWidth, aspectRatio } = this.state;
		const canvasHeight = canvasWidth / aspectRatio;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		console.log({ aspectRatio, canvasWidth, canvasHeight });

		const img = this.getElem('img');

		if (img.naturalHeight)
			this.cropImage();
	}

	async takePhoto() {
		const picData = webcam.snap();
		await this.getImageData(picData);
		await this._setState({ webcamOpen: false });
		webcam.stop();
	}

	flipCamera() {
		webcam.flip();
	}

	async openCam() {

		await this._setState({ webcamOpen: true });

		const audio = document.getElementById(this.audioId);
		const video = document.getElementById(this.videoId);
		const canvas = this.getElem('canvas');
		webcam = new WebCam(video, 'user', canvas, audio);

		webcam.start();

	}

	async initializeCanvas() {

		try {
			const aspectRatio = parseFloat(this.props.aspectRatio) || 1;
			const div = this.getElem('div');

			const canvasWidth = div.offsetWidth;
			await this._setState({ canvasWidth, aspectRatio });

		} catch (err) {

		}

	}

	async _setState(obj) {
		const newState = { ...this.state , ...obj };
		//console.log(newState);
		const zoomFactorBefore = this.state.zoomFactor;
		await this.setState(newState);
		const zoomFactorAfter = this.state.zoomFactor;

		if (zoomFactorBefore && !zoomFactorAfter) {
			console.log('zoomFactor vanished', obj);
		} else if (zoomFactorAfter && !zoomFactorBefore) {
			console.log('zoomFactor set', obj);
		} else if (zoomFactorBefore !== zoomFactorAfter) {
			console.log('zoomFactor updated', obj);
		}

	}

	async componentDidUpdate(prevProps, prevState) {
		
		if (prevState.aspectRatio !== this.state.aspectRatio)
			return this.updateCanvasDimensions();

		if (prevState.canvasWidth !== this.state.aspectRatio)
			return this.updateCanvasDimensions();

	}

	state = {}

	componentDidMount() {

		window.addEventListener('resize', this.initializeCanvas.bind(this));
		window.addEventListener('resize', this.updateWindowDimensions.bind(this));
		this.initializeCanvas();
		this.updateWindowDimensions();

	}

	render() {

		const { id=this.id, webcam } = this.props;
		const { webcamOpen=false } = this.state;

		const openFileDialog = this.openFileDialog.bind(this);
		const getImageData = this.getImageData.bind(this);
		const zoomOut = this.zoomOut.bind(this);
		const zoomIn = this.zoomIn.bind(this);
		const openCam = this.openCam.bind(this);
		const takePhoto = this.takePhoto.bind(this);
		const flipCamera = this.flipCamera.bind(this);
		const canvasOnPointerDown = this.canvasOnPointerDown.bind(this);
		const canvasOnPointerUp = this.canvasOnPointerUp.bind(this);

		const	controlPanelJSX = <Grid container style={divControlPanelStyle}>

			<Grid item xs={3}>
				<Button onClick={zoomOut}>
					<ZoomOut />
				</Button>
			</Grid>

			<Grid item xs={3}>
				<Button onClick={openFileDialog}>
					<Publish />
				</Button>
			</Grid>

			<Grid item xs={3}>
				<Button onClick={zoomIn}><ZoomIn /></Button>
			</Grid>

			<Grid item xs={3}>
				<Button onClick={openCam} disabled={!webcam}>
					<CameraAlt />
				</Button>
			</Grid>

		</Grid>

		let webcamJSX;

		if (webcam) {

			webcamJSX = <Dialog open={webcamOpen}>
				<DialogContent style={{ padding: 0, margin: 0 }} id="dialogContent">
					<video id={this.videoId} style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}></video>
					<audio id={this.audioId}></audio>

					<div style={{ background: 'transparent', textAlign: 'center', position: 'absolute', width: '100%', bottom: '40px' }}>
						<span style={{ background: 'white', display: 'inline-block', padding: '5px', borderRadius: '5px' }}>
							<Button style={{ background: 'inherit' }} onClick={takePhoto}>
								<Camera />
							</Button>
							<Button style={{ background: 'inherit' }} onClick={flipCamera} >
								<FlipCameraAndroidIcon />
							</Button>
						</span>
					</div>

				</DialogContent>
			</Dialog>
		}

		return <div id={id} style={divStyle}>

			<input type="file" style={inputStyle} accept="image/*" onChange={getImageData} />
			<canvas onPointerDown={canvasOnPointerDown} style={canvasStyle} onPointerUp={canvasOnPointerUp}></canvas>
			<img style={imgStyle} alt="" />

			{controlPanelJSX}

			{webcamJSX}

		</div>
	}
}

export default CropImage;
