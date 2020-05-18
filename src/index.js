import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Register from './Auth/Register';
import Login from './Auth/Login';
import firebase from './firebase';
import {createStore} from 'redux';
import {Provider , connect} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './Reducer/index';
import {setUser , clearUser} from './Actions/action';
import Spinner from './Spinner';





const store = createStore(rootReducer , composeWithDevTools())







class Root extends Component {

  componentDidMount() {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        if (user) {
          this.props.setUser(user);
          this.props.history.push("/");
        } else {
          this.props.history.push("/login");
          this.props.clearUser();
        }
      })
  }


  render() {
    return this.props.isloading ? <Spinner /> : (
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
        </Switch>
      )
    
  }
}
const mapStateFromProps = state =>{
  return{
    isloading : state.user.loading
  }

}


const RootWithAuth = withRouter(connect(mapStateFromProps , {setUser ,clearUser })(Root));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <RootWithAuth />
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
