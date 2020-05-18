import React, { Component } from 'react'
import { Segment, Header, Icon, Input } from 'semantic-ui-react'



class MessageHeader extends Component {

    render() {
        const { departmentName , uniqueUsers } = this.props;
        return (

            <Segment clearing>

                {/* CHANNEL TITLE */}

                <Header as="h2" floated="left" fluid="true" style={{ marginBottom: 0 }}>
                    <span>
                        {/* CHANNEL */}
                        {departmentName}
                        <Icon name="star outline" color="black" />
                    </span>
                    <Header.Subheader>{uniqueUsers}</Header.Subheader>

                    {/* CHANNEL SEARCH INPUT */}

                </Header>
                <Header floated="right">
                    <Input
                        size="small"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search messages"
                    />
                </Header>

            </Segment>

        );
    }
}


export default MessageHeader;