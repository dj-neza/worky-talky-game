import React, { useState } from "react";
import styled from "styled-components";
import Engine from "../../components/engine";
import { Briefcase } from "../../assets";
import List from "../../components/list";
import Popup from "../../components/popup";

const Header = styled.div`
    background-color: #26C6DA;
    display: flex;
    height: 70px;
    align-items: center;
    justify-content: flex-start;
    padding-left: 10px;
    margin-bottom: 10px;
    font-weight: 500;
    font-size: 23px;
    color: #E3F8FA;
`;
const Content = styled.div`
    margin: 10px;
    display: flex;
    justify-conent: space-evenly;
`;

const Container = styled.div`
    position: relative;
`;

const users = [
    { name: "You", status: "Available", gender: "F", color: "blue"},
    { name: "Lars", status: "In a meeting", gender: "M", color: "green"},
    { name: "Sarah", status: "Lunch", gender: "F", color: "#11696D"},
    { name: "Daniel", status: "Available", gender: "M", color: "#8623CC"},
    { name: "Andy", status: "Working", gender: "M", color: "#B52331"},
    { name: "Tina", status: "In a meeting", gender: "F", color: "#C62CC2"},
];

export default function Home() {
    const [connection, setConnection] = useState(null);
    const showToolbar = (link) => {
        setConnection(link);
    }
    const onClose = () => {
        setConnection(null);
    }
    return (
    <Container>
        <Header>
            <Briefcase width="50" heigh="50" />
            <Content>WorkyTalky</Content>
        </Header>
        <Content>
            <Engine onInteraction={(link) => showToolbar(link)} />
            <List items={users} />
        </Content>
        <Popup link={connection} close={onClose}/>
    </Container>
    );
}