import React from 'react';
import {Loader , Dimmer} from 'semantic-ui-react'

const spinner = () => {
    return (
        <Dimmer active>
            <Loader size="large" content="Prepairing Content ... " />
        </Dimmer>
    )
}

export default spinner;