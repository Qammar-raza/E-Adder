import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import UserPannel from './UserPannel';
import Department from './Department';
import Problems from './Problems'
import '../App.css'

class SidePannel extends Component {
    render() {
        return (
            <Menu
                vertical
                inverted
                size={window.innerWidth < 1033 ? "small": "large"}
                fixed="left"
                style={{
                    background: '#4c3c4c',

                }}
            >
                <UserPannel currentUser = {this.props.user}/>
                <Problems currentUser = {this.props.user}/>
                <Department currentUser = {this.props.user}/>

            </Menu>
        )
    }
}


export default SidePannel;