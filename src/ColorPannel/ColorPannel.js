import React, { Component } from 'react';
import { Sidebar, Menu, Button, Divider } from 'semantic-ui-react';


class ColorPannel extends Component {
    render(){
        return (
            <Sidebar
                as={Menu}
                vertical
                inverted
                visible
                icon="labeled"
                width="very thin"
            >
                <Divider />
                <Button icon="add" color="blue" size="tiny"></Button>

            </Sidebar>
        )
    }
}


export default ColorPannel;