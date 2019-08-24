import React from "react";
import styled from "styled-components";
import socketIOClient from "socket.io-client";

const Container = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;

  border: 1px solid black;
`;

const ChatContainer = styled.div`
  width: 50%;
  height: 100vh;

  display: flex;
  flex-direction: column;

  border: 1px solid black;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 90%;

  display: flex;
  flex-direction: column;

  border: 1px solid black;
`;

const ContentBox = styled.div`
  background-color: lightgrey;
  padding: 10px;
`;

const MessageContainer = styled.form`
  width: 100%;
  height: 10%;

  display: flex;

  border: 1px solid black;
`;

const MessageBox = styled.input`
  width: 90%;
  height: 100%;

  border: 1px solid black;
`;

const Button = styled.button`
  width: 10%;
  height: 100%;

  border: 1px solid black;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      endpoint: "http://localhost:4000",
      message: "",
      messageFromServer: [],
      socket: null
    };
  }

  componentDidMount = async () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("message", msg => {
      const newMessages = this.state.messageFromServer;
      newMessages.push(<ContentBox>{msg}</ContentBox>);

      this.setState({
        messageFromServer: newMessages
      });
    });
    await this.setState({
      socket: socket
    });
    console.log(this.state.socket);
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    await this.state.socket.emit("submit message", this.state.message);
    this.setState({
      message: ""
    });
  };

  render() {
    return (
      <Container>
        <ChatContainer>
          <ContentContainer>{this.state.messageFromServer}</ContentContainer>
          <MessageContainer onSubmit={this.handleSubmit.bind(this)}>
            <MessageBox
              type="text"
              name="message"
              value={this.state.message}
              onChange={this.handleChange.bind(this)}
            />
            <Button onClick={this.handleChange.bind(this)}>전송</Button>
          </MessageContainer>
        </ChatContainer>
      </Container>
    );
  }
}

export default App;
