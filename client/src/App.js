import React from "react";
import styled from "styled-components";
import socketIOClient from "socket.io-client";
import fireSound from "./sounds/fire.mp3";
import beachWaveSound from "./sounds/beach_wave.mp3";
import background_beach_night from "./background-image/beach_night.jpg";
import background_fire_night from "./background-image/fire_night.jpg";

const Container = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;

  background-image: url(${props =>
    props.theme === "beach_night"
      ? background_beach_night
      : props.theme === "fire_night"
      ? background_fire_night
      : ""});
  background-size: 100% 100%;

  font-family: Helvetica;
`;

const ChatContainer = styled.div`
  width: 50%;
  height: 100vh;

  display: flex;
  flex-direction: column;

  background-color: rgba(0, 0, 0, 0.3);

  @media only screen and (max-width: 720px) {
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 90%;

  display: flex;
  flex-direction: column;

  overflow: scroll;
  border: 1px solid black;
`;

const ContentBox = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  padding: 10px;
`;

const MessageContainer = styled.form`
  width: 100%;
  height: 10%;

  display: flex;
`;

const MessageBox = styled.input`
  width: 90%;
  height: 100%;
  font-size: 1rem;

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
      endpoint: "/",
      message: "",
      messageFromServer: [],
      socket: null,
      theme: "beach_night"
    };

    this.ContentContainerRef = React.createRef();
  }

  componentDidMount = async () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("message", async msg => {
      const newMessages = this.state.messageFromServer;
      newMessages.push(<ContentBox>{msg}</ContentBox>);

      await this.setState({
        messageFromServer: newMessages
      });

      this.ContentContainerRef.current.scrollTop = this.ContentContainerRef.current.clientHeight;
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
    const { theme } = this.state;
    return (
      <Container theme={this.state.theme}>
        <ChatContainer>
          <ContentContainer ref={this.ContentContainerRef}>
            {this.state.messageFromServer}
          </ContentContainer>
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

        {/* audio section */
        theme === "beach_night" ? (
          <audio src={beachWaveSound} autoPlay loop />
        ) : theme === "fire_night" ? (
          <audio src={fireSound} autoPlay loop />
        ) : (
          ""
        )}
      </Container>
    );
  }
}

export default App;
