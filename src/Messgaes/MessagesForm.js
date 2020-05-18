import React, { Component } from 'react'
import { Segment, Input, Button } from 'semantic-ui-react';
import firebase from '../firebase';


class MessagesForm extends Component {

    state ={
        message :'',
        currentDepartmentId : this.props.departmentId ,
        currentUser : this.props.currentUser,
        loading : false ,
        errors : [],
    }
    inputChangeHandle = event =>{
        this.setState({
            [event.target.name] : event.target.value
        })
    }


    sendMessage = () => {
        const {messagesRef } = this.props;

        const message = {
            timestamp : firebase.database.ServerValue.TIMESTAMP,
            conntent : this.state.message,
            user : {
                id : this.state.currentUser.uid,
                name : this.state.currentUser.displayName,
                avatar : this.state.currentUser.photoURL
            }
        }
        
        
        if(this.state.message){
            this.setState({loading : false});
            console.log(this.state.currentDepartmentId.id);
        
            messagesRef
                .child(this.state.currentDepartmentId.id)
                .push()
                .set(message)
                .then(()=>{
                    this.setState({
                        loading :false,
                        message : '',
                    })
                    console.log('message added in database');
                })
                .catch(err=>{
                    this.setState({
                        errors : this.state.errors.concat(err),
                        loading : false});
                })
        }else{
            this.setState({
                errors : this.state.errors.concat({message : 'Add a message'})
            })
        }
    }



    render() {
        return (
            <Segment className="messages_form">
                <Input
                    fluid
                    name="message"
                    value={this.state.message}
                    onChange={this.inputChangeHandle}
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition="left"
                    placeholder="Write Your Message"
                    disabled ={this.state.loading}
                    className = {
                        this.state.errors.some(err => err.message.includes('message')) ? 'error': ''
                    }
                />
                <Button.Group icon widths={2}>
                    <Button
                        color="orange"
                        labelPosition="left"
                        icon="edit"
                        content="Add Reply"
                        onClick={this.sendMessage}
                    />
                    <Button
                        color="teal"
                        labelPosition="right"
                        icon="cloud upload"
                        content="Upload Media"
                    />
                </Button.Group>
            </Segment>
        )
    }
}

export default MessagesForm;