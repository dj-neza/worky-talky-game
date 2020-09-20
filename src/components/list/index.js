import React from "react";
import styled from "styled-components";
import { Guy, Girl, On, Off, Ish } from "../../assets";

const Container = styled.div`
  width: 300px;
  border: 1px solid #26C6DA;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #26C6DA;
  height: 50px;
  padding-left: 10px;
`;

const Space1 = styled.div`
  margin-left: 10px;
  color: #26C6DA;
  font-weight: 500;
`;
const Space2 = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
`;
const Space3 = styled.div`
  margin-left: 10px;
`;

const Flex = styled.div`
  display: flex;
`;

const List = ({ items }) => {
  return (
    <Container>
      {items.map(item => (
        <Item>
          <Flex>
            {item.gender === "F" ? <Girl width="15" fill={item.color} /> : <Guy width="15" fill={item.color} />}
            <Space1>{item.name}</Space1>
          </Flex>
          <Space2>
            {item.status === "Available" && <On width="10"/>}
            {item.status === "In a meeting" && <Off width="10"/>}
            {item.status === "Lunch" && <Ish width="10"/>}
            {item.status === "Working" && <Ish width="10"/>}
            <Space3>{item.status}</Space3>
          </Space2>
        </Item>
      ))}
    </Container>
  );
};

export default List;