import React from "react";
import Container from "react-bootstrap/Container";

export const StatusData = ({ status }) => {
  let statusMessage = "";

  switch (status) {
    default:
      statusMessage = "";
      break;
    case "fetching":
      statusMessage = "Получение данных погоды";
      break;
    case "unable":
      statusMessage = "Невозможно получить геолокацию";
      break;
    case "unsupported":
      statusMessage = "Геолокация недоступна или заблокирована";
      break;
  }

  return (
    <Container className="text-center mt-5">
      <h3 className="status-message">{statusMessage}</h3>
    </Container>
  );
};
