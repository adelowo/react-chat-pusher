import React from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import './App.css';

const testToken = 'PUSHER_TOKEN_URL';
const instanceLocator = 'PUSHER_INSTANCE_LOCATOR';
const roomId = 'ROOM_ID';
const USER_ID = 'USER_ID';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    const chatManager = new ChatManager({
      instanceLocator: instanceLocator,
      userId: USER_ID,
      tokenProvider: new TokenProvider({
        url: testToken,
      }),
    });

    chatManager.connect().then(currentUser => {
      this.currentUser = currentUser;
      this.currentUser.subscribeToRoom({
        roomId: roomId,
        hooks: {
          onMessage: message => {
            this.setState({
              messages: [...this.state.messages, message],
            });
          },
        },
      });
    });
  }

  sendMessage = text => {
    this.currentUser.sendMessage({
      text,
      roomId: roomId,
    });
  };

  render() {
    return (
      <div className="app">
        <Title />
        <MessageList
          roomId={this.state.roomId}
          messages={this.state.messages}
        />
        <SendMessageForm sendMessage={this.sendMessage} />
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    return (
      <ul className="message-list">
        {this.props.messages.map((message, index) => {
          return (
            <li key={message.id} className="message">
              <div>{message.senderId}</div>
              <div>{message.text}</div>
            </li>
          );
        })}
      </ul>
    );
  }
}

class SendMessageForm extends React.Component {
  constructor() {
    super();
    this.state = {
      message: '',
    };
  }

  handleChange = e => {
    this.setState({
      message: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.sendMessage(this.state.message);
    this.setState({
      message: '',
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="send-message-form">
        <input
          onChange={this.handleChange}
          value={this.state.message}
          placeholder="Type your message and hit ENTER"
          type="text"
        />
      </form>
    );
  }
}

function Title() {
  return <p className="title">My awesome chat app</p>;
}

export default App;
