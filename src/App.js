import React from 'react';
import { Grid } from 'semantic-ui-react';
import ColorPannel from './ColorPannel/ColorPannel';
import SidePannel from './Sidepannel/SidePannel';
import Messages from './Messgaes/Messages';
import MetaPannel from './MetaPannel/MetaPannel';
import {connect} from 'react-redux'
import './App.css';
// import { setCurrentDepartment } from './Actions/action';

const App = props => {

  return (
    <Grid columns="equal" className="App">
      <ColorPannel />
      <SidePannel
        key ={props.currentUser && props.currentUser.uid} 
        user = {props.currentUser}
      />
      
      <Grid.Column style={{marginLeft : window.innerWidth < 1033 ? '17rem' : '22rem' }}>
        <Messages 
          key ={props.currentDepartment && props.currentDepartment.id}
          currentDepartment = {props.currentDepartment}
          currentUser = {props.currentUser}
          problemDepartment = {props.problemDepartment}
          problemDepartmentId = {props.problemDepartmentId}
        />
      </Grid.Column>
      
      <Grid.Column width={2}>
        <MetaPannel />
      </Grid.Column>

    </Grid>
  );
}


const mapStateFromProps = state =>{
  return {
    currentUser : state.user.currentUser ,
    currentDepartment : state.department.currentDepartment ,
    problemDepartment : state.department.problemDepartment,
    problemDepartmentId : state.problem.currentDepartmentId,
  }

}


export default connect(mapStateFromProps)(App);
