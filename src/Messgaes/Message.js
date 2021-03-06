import React from 'react'
import { Comment } from 'semantic-ui-react';
import moment from 'moment';



const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'message_self' : '';
};

const timeFromNow = timestamp => moment(timestamp).fromNow();


const message = ({ message, user }) => (
    <Comment >
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content className={isOwnMessage(message, user)}>
            <Comment.Author as="a" >{message.user.name}</Comment.Author>
            <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
            <Comment.Text>{message.conntent}</Comment.Text>
        </Comment.Content>
    </Comment>
);

export default message;