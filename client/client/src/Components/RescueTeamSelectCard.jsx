import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { ListGroup } from "react-bootstrap";

function RescueTeamSelectCard(props) {
  const listitems = props.facilities.map((item) => (
    <ListGroup.Item>{item}</ListGroup.Item>
  ));

  return (
    <div className="align-items-center">
      <Card style={{ width: "40rem" }}>
        <Card.Header as="h5">{props.RescueTeamName}</Card.Header>
        <Card.Body>
          <Card.Text>Facilites Offered</Card.Text>
          <Card.Text>{listitems}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="outline-primary">Connect</Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default RescueTeamSelectCard;
