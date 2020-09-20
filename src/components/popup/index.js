import React from "react";
import styled from "styled-components";
import { Star } from "../../assets";

const Container = styled.div`
  position: absolute;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Tooltip = styled.div`
  background-color: #E3F8FA;
  opacity: 1;
  text-align: center;
  padding: 20px;
`;

const Row = styled.div`
  display: flex;
`;

const Title = styled.div`
  margin: 10px;
`;

const Button = styled.a`
  background-color: #26C6DA;
  text-decoration: none;
  color: white;
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  &:hover {
    background-color: #278C93;
  }
  &:active {
    background-color: #278C93;
  }
`;
const Popup = ({ link, close }) => {
  return (
    link !== null && <Container>
      <Tooltip>
        <Star width="30" height="30" /><br />
        <Title>Daniel just ran into you!</Title>
        <Row>
          <Button onClick={() => close()}>I'm busy</Button>
          <Button href={link}>Let's chat!</Button>
        </Row>
      </Tooltip>
    </Container>
  );
};

export default Popup;