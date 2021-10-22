import { React, useState, useEffect } from 'react'
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import BackendApi from './BackendApi';

export default function ThermostatController() {

	const [formData, setFormData] = useState({ mode: "", modeOptions: ["OFF", "COOL", "HEAT"], temp: "", autodetect: "OFF" });
	// const [deviceInformation, setDeviceInformation] = useState();
	const [weatherInformation, setWeatherInformation] = useState([]);


	const convertCelsiusToFahrenheit = (cel) => {
		return (cel * (9 / 5) + 32).toFixed(1);
	}

	const updateWeatherInfo = async () => {
		setWeatherInformation([]);//to load the spinner
		const weatherInfo = await BackendApi.getWeatherInfo();
		console.log(weatherInfo);
		setWeatherInformation([weatherInfo.weather.main.feels_like, weatherInfo.weather.main.temp, weatherInfo.weather.main.humidity]);
	}

	const updateTemperature = (deviceInfo, mode) => {
		let temp = "";
		if (mode === "COOL") temp = convertCelsiusToFahrenheit(deviceInfo.devices[0].traits["sdm.devices.traits.ThermostatTemperatureSetpoint"]['coolCelsius']);
		else if (mode === "HEAT") temp = convertCelsiusToFahrenheit(deviceInfo.devices[0].traits["sdm.devices.traits.ThermostatTemperatureSetpoint"].heatCelsius);
		return temp;
	}

	const initData = async () => {

		const deviceInfo = await BackendApi.getDeviceInfo();
		// setDeviceInformation(deviceInfo.devices[0]);

		await updateWeatherInfo();
		const mode = deviceInfo.devices[0].traits["sdm.devices.traits.ThermostatMode"].mode;
		document.getElementById("mode").value = mode;
		let temp = updateTemperature(deviceInfo, mode);

		//get the current status of the smart detector
		const statusResponse = await BackendApi.changeTimer("");
		const status = statusResponse.status.toUpperCase();
		document.getElementById("autodetect").value = status;
		setFormData(data => ({
			...data,
			mode: mode,
			temp: temp,
			autodetect: status
		}));
	}

	//initialize UI data
	useEffect(() => {

		initData();

	}, []);

	const formChangeHandler = async (evt) => {

		// console.log(evt.target.value);
		const { name, value } = evt.target;

		console.log(name, value);
		setFormData(data => ({
			...data,
			[`${name}`]: value
		}));

		if (name === "mode") {
			await BackendApi.changeMode(value.toUpperCase());
		} else if (name === "autodetect") {
			await BackendApi.changeTimer("start");
		}
		if (name === "mode") {
			const deviceInfo = await BackendApi.getDeviceInfo();
			const mode = deviceInfo.devices[0].traits["sdm.devices.traits.ThermostatMode"].mode;
			const temp = await updateTemperature(deviceInfo, mode);
			setFormData(data => ({
				...data,
				temp
			}))
		}
	}

	const changeTemp = async () => {
		console.log(`changing temp to: ${formData.temp}`)
		await BackendApi.changeTemperature(formData.temp, formData.mode);
	}

	return (
		<div className="mt-3">
			<Row className="justify-content-center">
				<h1>Temperature Controller</h1>
			</Row>
			<Row className="justify-content-center mt-5">
				<Col xs={8}>

					<Form.Group as={Row} id="mode">
						<Form.Label column sm={5}><h3>Mode</h3></Form.Label>
						<Col sm={6}>
							<Form.Control as="select" size="lg" name="mode" onChange={formChangeHandler} value={formData.mode} >
								{formData.modeOptions.map(val => <option key={val}>{val}</option>)}
							</Form.Control>
						</Col>
					</Form.Group>

					<Form.Group as={Row} id="temp">
						<Form.Label column sm={5}><h3>Temperature</h3></Form.Label>
						<Col sm={5}>
							<Form.Control type="number" size="lg" name="temp" onChange={formChangeHandler} value={formData.temp}></Form.Control>
						</Col>
						<Col sm={1}>
							<Button variant="primary" name="confirm" onClick={changeTemp}>Confirm</Button>
						</Col>

					</Form.Group>

					<Form.Group as={Row} id="autodetect">
						<Form.Label column sm={5}><h3>Autodetect temp outside</h3></Form.Label>
						<Col sm={6}>
							<Form.Control as="select" size="lg" name="autodetect" onChange={formChangeHandler} value={formData.autodetect}>
								<option key={1}>ON</option>
								<option key={2}>OFF</option>
							</Form.Control>
						</Col>
					</Form.Group>
				</Col>
				<Col xs="8">
					<Row>
						<Col sm={5}>
							<h3>Weather Info</h3>
						</Col>
						<Col sm={6}>
							<Card>
								<Card.Header>
									<h5>Refresh: <Button variant="outline-primary" id="refreshBtn" onClick={updateWeatherInfo}><i className="fas fa-sync"></i></Button></h5>
								</Card.Header>
								<Card.Body>
									{weatherInformation.length === 3 ?
										<>
											<p>Feels Like: {weatherInformation[0]}</p>
											<p>Actual Temp: {weatherInformation[1]}</p>
											<p>Humidity: {weatherInformation[2]}</p>
										</>
										:
										<Spinner animation="border" />}

								</Card.Body>
							</Card>
						</Col>

					</Row>
				</Col>
			</Row >


		</div >
	)
}
