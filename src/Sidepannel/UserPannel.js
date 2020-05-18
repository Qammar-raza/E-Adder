import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor';
import firebase from '../firebase';



class UserPannel extends Component {



    state = {
        storageRef: firebase.storage().ref(),
        userRef: firebase.database().ref('users'),
        user: this.props.currentUser,
        preveiwImage: '',
        croppedImage: '',
        uploadedCroppedImage: '',
        blob: '',
        metaData: {
            contentType: 'image/jpeg'
        },
        modal: false
    }

    displayOptions = () => {
        return [
            {
                key: 'user',
                text: <span>Signed in as ${this.state.user.displayName}</span>,
                disabled: true
            },
            {
                key: 'avatar',
                text: <span onClick={this.openModal}>Change Avatar</span>
            },
            {
                key: 'signout',
                text: <span onClick={this.signOut}>Sign Out</span>
            }
        ]
    }
    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });

    signOut = () => {

        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log('user is signed out')
            }).catch(err => {
                console.log(err)
            })
    }

    inputChangeHandler = event => {
        const file = event.target.files[0];
        console.log(file);
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file)
            reader.addEventListener('load', () => {
                console.log(reader);
                this.setState({
                    preveiwImage: reader.result
                })
            })
        }
    }

    veiwCroppedImage = () => {
        console.log(this.avatarEditor);
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                console.log(blob);
                let imageURL = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageURL,
                    blob: blob
                })
            })
        }
    }

    uploadImage = () => {
        const { storageRef, user, blob, metaData } = this.state;

        storageRef
            .child(`avatar/user-${user.uid}`)
            .put(blob, metaData)
            .then(snap => {
                snap.ref.getDownloadURL()
                    .then(fileURL => {
                        this.setState({
                            uploadedCroppedImage: fileURL
                        }, () => this.changingUIAvatar())
                    })

            })
    }
    changingUIAvatar = () => {
        this.state.user
            .updateProfile({
                photoURL: this.state.uploadedCroppedImage
            })
            .then(() => {
                console.log('image uploaded at the user interface level')
            })
            .catch(err => {
                console.log(err)
            })
        this.state.userRef
            .child(this.state.user.uid)
            .update({
                avatar: this.state.uploadedCroppedImage
            })
            .then(() => {
                console.log('image uploaded at the user database load');
                this.closeModal();
            })
            .catch(err => {
                console.log(err)
            })
    }


    render() {
        return (
            <Grid>
                <Grid.Column>
                    <Grid.Row style={{ margin: 0, paddingTop: '2rem' }}>
                        <Header as="h2" floated="left" inverted>
                            <Icon name="code" />
                            <Header.Content>
                                E_Adder
                            </Header.Content>
                        </Header>
                        <Header as="h4" inverted>
                            <Dropdown
                                trigger={
                                    <span>
                                        <Image src={this.state.user.photoURL} spaced="right" avatar />
                                        {
                                            this.state.user.displayName
                                        }

                                    </span>
                                }
                                options={this.displayOptions()}
                            />
                        </Header>
                    </Grid.Row>

                    <Modal basic open={this.state.modal} onClose={this.closeModal}>
                        <Modal.Header as="h2">
                            Change Avatar
                        </Modal.Header>
                        <Modal.Content>
                            <Input
                                name="file"
                                type="file"
                                label="New Avatar"
                                fluid
                                onChange={this.inputChangeHandler}
                            />  
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui center aligned grid">
                                        <AvatarEditor
                                            ref={node => this.avatarEditor = node}
                                            image={this.state.preveiwImage}
                                            height={180}
                                            width={180}
                                            scale={1.2}
                                            border={50}
                                            style={{ margin: '1.5em auto' }}
                                        />
                                    </Grid.Column>
                                    <Grid.Column>
                                        {this.state.croppedImage ?
                                            <Image
                                                src={this.state.croppedImage}
                                                width={110}
                                                height={110}
                                                style={{ margin: '3.5em auto' }}
                                            />
                                            : null
                                        }
                                    </Grid.Column>

                                </Grid.Row>

                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {this.state.croppedImage &&
                                <Button color="green" onClick={this.uploadImage} inverted>
                                    <Icon name="checkmark" />
                                    Save Changes
                                </Button>
                            }

                            <Button color="green" onClick={this.veiwCroppedImage} inverted>
                                <Icon name="image" />
                                Preveiw Image
                            </Button>
                            <Button color="red" onClick={this.closeModal} inverted>
                                <Icon name="cancel" />
                                Cancel
                            </Button>
                        </Modal.Actions>
                    </Modal>




                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPannel;

