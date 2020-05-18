import React, { Component } from 'react';
import { Grid, Header, Icon, Form, Segment, Button, Message } from 'semantic-ui-react';
import firebase from '../firebase';
import { Link } from 'react-router-dom';



class Login extends Component {


    state = {
        email: '',
        password: '',
        loading: false,
        errors: []
    }

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    submitHandler = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({
                loading: true
            })
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(userSignedIn => {
                    console.log(userSignedIn)
                }).catch(err => {
                    console.log(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                })


        }
    }
    isFormValid = ({ email, password }) => {
        return email && password;
    }
    displayErrorMessage = errors => errors.map((err, i) => (
        <p key={i}> {err.message}</p>
    ))


    render() {
        return (
            <Grid textAlign="center" verticalAlign="middle" className="App">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon textAlign="center" color="black">
                        <Icon name="code branch" inverted color="purple" />
                        Login To Employee Adder
                    </Header>
                    <Form onSubmit={this.submitHandler}>
                        <Segment stacked>
                            <Form.Input
                                name="email"
                                icon="mail"
                                type="mail"
                                iconPosition="left"
                                placeholder="Email"
                                onChange={this.inputChangeHandler}
                            />
                            <Form.Input
                                name="password"
                                icon="lock"
                                iconPosition="left"
                                type="password"
                                placeholder="Password"
                                onChange={this.inputChangeHandler}
                            />
                            <Button
                                fluid
                                size="large"
                                color="blue"
                                disabled={this.state.loading}
                                className={this.state.loading ? 'loading' : 'null'}
                            >Submit</Button>
                        </Segment>
                    </Form>
                    {this.state.errors.length > 0 ?
                        <Message error>
                            Error
                            {this.displayErrorMessage(this.state.errors)}
                        </Message>
                        : null}
                    <Message>
                        Don't have an account ?
                        <Link to="/register" > Register Now </Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}



export default Login;