import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Send from '@material-ui/icons/Send';

import './ChatComponent.css';
import { Tooltip } from '@material-ui/core';

export default class ChatComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: this.props.messagelist,
            message: '',
            name: this.props.name
        };
        this.chatScroll = React.createRef();
        
        this.handleChange = this.handleChange.bind(this);
        this.handlePressKey = this.handlePressKey.bind(this);
        this.close = this.close.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        console.log('newlist-555555555-' + nextProps.messagelist);
        this.setState({messageList: nextProps.messagelist});
    }

    handleChange(event) {
        this.setState({ message: event.target.value });
    }

    handlePressKey(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    sendMessage() {
        console.log(this.state.message);
        this.props.onSendMessage(this.state.message);
        this.setState({ message: '' });
    }

    scrollToBottom() {
        setTimeout(() => {
            try {
                this.chatScroll.current.scrollTop = this.chatScroll.current.scrollHeight;
            } catch (err) {}
        }, 20);
    }

    close() {
        this.props.close(undefined);
    }

    render() {
        const styleChat = { display: this.props.chatDisplay };
        return (
            <div id="chatContainer">
                <div id="chatComponent" style={styleChat}>
                    <div id="chatToolbar">
                        <span className="name">{this.state.name}</span>
                    </div>
                    <div className="message-wrap" ref={this.chatScroll}>
                        {this.state.messageList.map((data, i) => (
                            <div
                                key={i}
                                id="remoteUsers"
                                className={data.type? "message  right" : "message left" }
                            >
                                <canvas id={'userImg-' + i} width="60" height="60" className="user-img" />
                                <img src="userAvatar1.png" id={'userImg-' + i} style={{width: '60px', height: '60px'}} className="user-img" alt={'Avatar Img'}/>
                                <div className="msg-detail">
                                    <div className="msg-info">
                                        <p> {data.name}</p>
                                    </div>
                                    <div className="msg-content">
                                        <span className="triangle" />
                                        <p className="text">{data.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div id="messageInput">
                        <input
                            placeholder="Send a messge"
                            id="chatInput"
                            value={this.state.message}
                            onChange={this.handleChange}
                            onKeyPress={this.handlePressKey}
                        />
                        <Tooltip title="Send message">
                            <Fab size="small" id="sendButton" onClick={this.sendMessage}>
                                <Send style={{color: "#ffffff"}}/>
                            </Fab>
                        </Tooltip>
                    </div>
                </div>
            </div>
        );
    }
}
