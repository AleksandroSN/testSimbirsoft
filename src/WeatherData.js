import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import "bootswatch/dist/superhero/bootstrap.css";

export const WeatherData = ({ data }) => {
  const {
    name,
    country,
    temp,
    description,
    temp_min,
    temp_max,
    icon,
    feels_like,
  } = data;

  return (
    <>
      <header>
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand href="./">
            <h1>Simple Weather React-App</h1>
          </Navbar.Brand>
        </Navbar>
      </header>
      <Container className="mt-5">
        <Jumbotron>
          <main>
            <Row xs={12} md={10} className="weather-main">
              <img
                src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                alt="weather icon"
                className="weather-icon"
              />
              <div>
                <h2>
                  {name}, {country}
                </h2>
                <h3 className="description">{description}</h3>
              </div>
            </Row>
            <div className="temp-main">
              <h2 className="temperature">{temp}°</h2>
              <h5>Ощущается как {feels_like} °</h5>
              <div className="high-low">
                <h5>макс.t {temp_max}°</h5>
                <h5>мин.t {temp_min}°</h5>
              </div>
            </div>
          </main>
          <footer></footer>
        </Jumbotron>
      </Container>
    </>
  );
};
