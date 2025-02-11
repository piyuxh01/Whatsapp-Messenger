import React, { useEffect, useContext, useState } from 'react';
import { Box } from '@mui/material';
import { UserContext } from '../../../context/UserProvider';
import { AccountContext } from '../../../context/AccountProvider';
import { fetchChatMessages, getConversation } from '../../../service/api';

//components
import ChatHeader from './ChatHeader';
import Messages from './Messages';

const ChatBox = () => {
    const { person } = useContext(UserContext);
    const { account } = useContext(AccountContext);

    const [conversation, setConversation] = useState({});
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        const getConversationDetails = async () => {
            let data = await getConversation({ senderId: account.sub, receiverId: person.sub });
            setConversation(data);
        }
        getConversationDetails();
    }, [person.sub]);

    useEffect(() => {
        const getMessages = async () => {
            if (account && account.sub) {
                try {
                    const response = await fetchChatMessages(account.sub);
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching chat messages:', error);
                }
            }
        };

        getMessages();
    }, [account.sub]);

    return (
        <Box style={{height: '75%'}}>
            <ChatHeader person={person} />
            <Messages person={person} conversation={conversation} />
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        <p>{message.text}</p>
                    </div>
                ))}
            </div>
        </Box>
    )
}

export default ChatBox;