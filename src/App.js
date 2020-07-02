import React from "react";
import "./App.css";
import { WeatherData } from "./WeatherData";
import { StatusData } from "./StatusData";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "init",
      isLoaded: false,
      weatherData: null,
    };
  }

  abortController = new AbortController();
  controllerSignal = this.abortController.signal;

  weatherInit = () => {
    const success = (pos) => {
      this.setState({ status: "fetching" });
      this.getCurrentWeatherData(pos.coords.latitude, pos.coords.longitude);
    };

    const error = () => {
      this.setState({ status: "unable" });
      alert("Геолокация недоступна");
    };

    if (navigator.geolocation) {
      this.setState({ status: "fetching" });
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      this.setState({ status: "unsupported" });
      alert("Ваш браузер не поддерживает геолокацию или нет доступа");
    }
  };

  getCurrentWeatherData = (lat, lon) => {
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=imperial`;

    fetch(weatherApi, { signal: this.controllerSignal })
      .then((response) => response.json())
      .then(
        (result) => {
          // console.log(result);
          const { name } = result;
          const { country } = result.sys;
          const { temp, temp_min, temp_max, feels_like } = result.main;
          const { description, icon } = result.weather[0];

          this.setState({
            status: "success",
            isLoaded: true,
            weatherData: {
              name,
              country,
              description,
              icon,
              temp: temp.toFixed(1),
              feels_like: feels_like.toFixed(1),
              temp_min: temp_min.toFixed(1),
              temp_max: temp_max.toFixed(1),
            },
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  };

  componentDidMount() {}

  componentWillUnmount() {
    this.abortController.abort();
  }

  onClick = () => {
    this.weatherInit();
  };

  returnActiveView = (status) => {
    switch (status) {
      case "init":
        return (
          <Container className="text-center" style={{ marginTop: "50vh" }}>
            <Button className="btn btn-danger" onClick={this.onClick}>
              Get My Location
            </Button>
          </Container>
        );
      case "success":
        return <WeatherData data={this.state.weatherData} />;
      default:
        return <StatusData status={status} />;
    }
  };

  render() {
    return (
      <div className="App">
        <div className="wrapper">
          {this.returnActiveView(this.state.status)}
        </div>
      </div>
    );
  }
}

export default App;
