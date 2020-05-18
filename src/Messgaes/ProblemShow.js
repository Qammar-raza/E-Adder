import React, { Fragment } from 'react';
import { Image, Modal, Header } from 'semantic-ui-react';

const problemsShow = props => {
    return (
        <Fragment>
            <Modal.Content image scrolling>
                <Image wrapped size='medium' src={props.pic} />
                <Modal.Description>
                    <Header inverted color="brown">{props.title}</Header>
                    <p style={{paddingLeft : '2rem'}}>
                       {props.details}
                    </p>
                    <p style={{paddingLeft : '2rem'}}>Is it okay to use this photo?</p>
                </Modal.Description>
            </Modal.Content>
        </Fragment>

    )
}




export default problemsShow;