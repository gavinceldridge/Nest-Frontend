import React from 'react'
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";


export default function WeatherCard({ updateWeatherInfo, weatherInformation }) {
    return (
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
        </Card>)
}
