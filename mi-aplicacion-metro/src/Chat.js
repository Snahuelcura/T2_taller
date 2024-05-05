import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importar axios
   //importar css
import './Chat.css';

const Chat = ({ websocket }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'message') {
            const newEntry = {
                content: message.data.content,
                timestamp: message.timestamp,
                name: message.data.name,
                isOutgoing: false
            };
            setMessages(prevMessages => [...prevMessages, newEntry]);
        }
    };

    useEffect(() => {
        if (websocket) {
            websocket.addEventListener('message', handleMessage);
        }
        return () => {
            if (websocket) {
                websocket.removeEventListener('message', handleMessage);
            }
        };
    }, [websocket]);

    const sendMessage = () => {
        const message = {
            type: 'CHAT',
            content: newMessage,
            timestamp: new Date().toISOString(),
            name: 'Your Name'
        };
        websocket.send(JSON.stringify(message));
        setMessages(prevMessages => [...prevMessages, { ...message, isOutgoing: true }]);
        setNewMessage('');
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.isOutgoing ? 'outgoing' : 'incoming'}`}>
                        <strong>{msg.name}:</strong> {msg.content}
                        <div>{new Date(msg.timestamp).toLocaleString()}</div>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
