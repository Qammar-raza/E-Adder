import React, { Component } from 'react';
import { Grid, Header, Icon, Form, Segment, Button, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../firebase';
import md5 from 'md5';


class Register extends Component {

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        userRef: firebase.database().ref('users')
    }



    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    submitHandler = event => {
        event.preventDefault();
        if (this.isFormValid()) {
            this.setState({
                errors: [],
                loading: true
            })
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(userCreated => {
                    console.log(userCreated);
                    userCreated.user
                        .updateProfile({
                            displayName: this.state.username,
                            photoURL: `https://api.adorable.io/avatars/56/${md5(userCreated.user.email)}@adorable.png`
                        })
                        .then(() => {
                            this.saveUser(userCreated);
                            console.log('user saved in database');
                        }).catch(err => {
                            console.log(err);
                            this.setState({
                                loading: false,
                                errors: this.state.errors.concat(err)
                            })
                        })
                }).catch(err => {
                    console.log(err)
                })
        }
    }

    saveUser = userCreated => {
        return this.state.userRef.child(userCreated.user.uid)
            .set({
                name: userCreated.user.displayName,
                avatar: userCreated.user.photoURL
            })
    }

    isFormValid = () => {

        let errors = [];
        let error;

        if (this.isFeildValid(this.state)) {
            error = "Please Fill All The Feilds";
            this.setState({
                errors: errors.concat(error)
            })
            return false;
        } else if (this.isPasswordValid(this.state)) {
            error = "Password is InValid"
            this.setState({
                errors: errors.concat(error)
            })
            return false;

        } else {
            return true;
        }

    }
    isFeildValid = ({ username, email, password, passwordConfirmation }) => {
        return !username || !email || !password || !passwordConfirmation
    }
    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return true;
        }
        else if (password !== passwordConfirmation) {
            return true;
        }
        else {
            return false
        }
    }

    displayError = errors => errors.map((err, i) => (
        <p key={i}>{err}</p>
    ))

    render() {
        return (
            <Grid textAlign="center" verticalAlign="middle" className="App">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" color="black" icon textAlign="center" >
                        <Icon name="puzzle piece" color="purple" inverted/>
                        Register to Employee Adder
                    </Header>
                    <Form onSubmit={this.submitHandler}>
                        <Segment stacked>
                            <Form.Input
                                name="username"
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                type="text"
                                onChange={this.inputChangeHandler}
                            />
                            <Form.Input
                                name="email"
                                icon="mail"
                                type="email"
                                iconPosition="left"
                                placeholder="Email"
                                onChange={this.inputChangeHandler}
                            />
                            <Form.Input
                                name="password"
                                icon="lock"
                                type="password"
                                iconPosition="left"
                                placeholder="Password"
                                onChange={this.inputChangeHandler}
                            />
                            <Form.Input
                                name="passwordConfirmation"
                                icon="repeat"
                                type="password"
                                iconPosition="left"
                                placeholder="Repeat Confirmation"
                                onChange={this.inputChangeHandler}
                            />
                            <Button
                                color="blue"
                                fluid
                                size="large"
                                disabled={this.state.loading}
                                className={this.state.loading ? 'loading' : ''}
                            >
                                Submit
                            </Button>
                        </Segment>
                    </Form>
                    {this.state.errors.length > 0 ?
                        <Message error>
                            Error
                            {this.displayError(this.state.errors)}
                        </Message>
                        : null}
                    <Message>
                        Already a member ?
                        <Link to="/login"> Login </Link>
                    </Message>

                </Grid.Column>
            </Grid>
        );
    }
}



export default Register;