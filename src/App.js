import React, { Component } from "react";
import "bootswatch/dist/journal/bootstrap.css";
import "./App.css";

import Navbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { geolocated, geoPropTypes } from "react-geolocated";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const PLACES = [
  { name: "Krasnodar", zip: "385123" },
  { name: "Magadan", zip: "685930" },
  { name: "Yoshkar-Ola", zip: "612313" },
  { name: "Suwałki", zip: "238745" },
];

const getDirection = (degrees, isLongitude) =>
  degrees > 0 ? (isLongitude ? "E" : "N") : isLongitude ? "W" : "S";

const formatDegrees = (degrees, isLongitude) =>
  `${0 | degrees}° ${
    0 | (((degrees < 0 ? (degrees = -degrees) : degrees) % 1) * 60)
  }' ${0 | (((degrees * 60) % 1) * 60)}" ${getDirection(degrees, isLongitude)}`;

const GeoCoordiante = (props) => (
  <div
    style={{
      fontSize: "large",
      fontWeight: "bold",
      margin: "2rem",
    }}
  >
    {!props.isGeolocationAvailable ? (
      <div>Your browser does not support Geolocation.</div>
    ) : !props.isGeolocationEnabled ? (
      <div>Geolocation is not enabled.</div>
    ) : props.coords ? (
      <div>
        You are at{" "}
        <span className="coordinate">
          {formatDegrees(props.coords.latitude, false)}
        </span>
        ,{" "}
        <span className="coordinate">
          {formatDegrees(props.coords.longitude, true)}
        </span>
        {props.coords.altitude ? (
          <span>
            , approximately {props.coords.altitude} meters above sea level
          </span>
        ) : null}
        .
      </div>
    ) : (
      <div>Getting the location data&hellip;</div>
    )}
    {!!props.positionError && (
      <div>
        <br />
        Last position error:
        <pre>{JSON.stringify(props.positionError)}</pre>
      </div>
    )}
  </div>
);

GeoCoordiante.propTypes = { ...GeoCoordiante.propTypes, ...geoPropTypes };

class WeatherDisplay extends Component {
  constructor() {
    super();
    this.state = {
      weatherData: null,
    };
  }
  componentDidMount() {
    const zip = this.props.zip;
    const URL =
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      zip +
      "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=imperial";
    fetch(URL)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ weatherData: json });
      });
  }
  render() {
    const weatherData = this.state.weatherData;
    if (!weatherData) return <div>Loading</div>;
    const weather = weatherData.weather[0];
    const iconUrl = "http://openweathermap.org/img/w/" + weather.icon + ".png";
    return (
      <div>
        <h1>
          {weather.main} in {weatherData.name}
          <img src={iconUrl} alt={weatherData.description} />
        </h1>
        <p>Current: {weatherData.main.temp}°</p>
        <p>High: {weatherData.main.temp_max}°</p>
        <p>Low: {weatherData.main.temp_min}°</p>
        <p>Wind Speed: {weatherData.wind.speed} mi/hr</p>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      activePlace: 0,
    };
  }
  render() {
    const activePlace = this.state.activePlace;
    return (
      <div className="App">
        <Navbar>
          <NavbarBrand>React Simple Weather App</NavbarBrand>
        </Navbar>
        <Container>
          <Row>
            <Col xl={4} sm={4}>
              <h3>Select a city</h3>
              <Nav
                className="flex-column"
                variant="pills"
                // stacked
                activeKey={activePlace}
                onSelect={(index) => {
                  this.setState({ activePlace: index });
                }}
              >
                {PLACES.map((place, index) => (
                  <Nav.Item key={index}>
                    <Nav.Link eventKey={index}>{place.name}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
            <Col xl={8} sm={8}>
              <GeoCoordiante />
              <WeatherDisplay key={activePlace} zip={PLACES[activePlace].zip} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(App);
