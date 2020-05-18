import React, { Component, Fragment } from 'react';

import { Menu, Icon, Modal, Form, Button, Input, TextArea, Grid, Image } from 'semantic-ui-react';

import AvatarEditor from 'react-avatar-editor';

import firebase from '../firebase';

import { connect } from 'react-redux';

import { setProblemDept ,setCurrentDepartment , setProblemDepartmentId } from '../Actions/action'
class Problems extends Component {

    state = {
        storageRef: firebase.storage().ref(),
        problemRef: firebase.database().ref('problems'),
        departmentRef: firebase.database().ref('departments'),
        user: this.props.currentUser,
        uploadedCroppedImage: '',
        departments: [],
        title: '',
        description: '',
        image: '',
        department: '',
        dept: '',
        blob: null,
        metaData: {
            contentType: 'image/jpeg'
        },
        preveiwImage: '',
        activeDepartment: '',
        modal: false,
       
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    componentDidMount() {
        this.addListener()

    }

    addListener = () => {
        let loadedDepts = [];
        this.state.departmentRef.on("child_added", snap => {
            // console.log(snap.val());
            loadedDepts.push(snap.val());
            this.setState({
                departments: loadedDepts
            })
        })
       
    }



    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    imageChangeHandler = event => {
        let file = event.target.files[0];
        let reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                this.setState({
                    image: reader.result
                })
            })
        }
    }
    croppedImage = () => {
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageURL = URL.createObjectURL(blob);
                this.setState({
                    preveiwImage: imageURL,
                    blob: blob
                })
            })
        }
    }

    uploadProblem = () => {
        const { storageRef, user, blob, metaData } = this.state;

        storageRef
            .child(`problems/users/user-${user.uid}`)
            .put(blob, metaData)
            .then(snap => {
                snap.ref.getDownloadURL()
                    .then(fileURL => {
                        this.setState({
                            uploadedCroppedImage: fileURL
                        }, () => this.uploadingToDatabase())

                    })
            })
    }
    uploadingToDatabase = () => {
        let dept = null;
        let key = this.state.problemRef.push().key;
        console.log(key);

        this.state.departmentRef.on("child_added", snap => {
            if (this.state.department === snap.val().name) {
                dept = snap.val().id;
                this.setState({
                    dept: dept
                })
            }
        })
        let newProblem = {
            id: key,
            title: this.state.title,
            description: this.state.description,
            picture: this.state.uploadedCroppedImage,
            department: this.state.department,
            createdBy: {
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        }
        if (this.state.dept) {
            this.state.problemRef
                .child(dept)
                .child(key)
                .update(newProblem)
                .then(() => {
                    this.setState({
                        title: '',
                        description: '',
                        uploadedCroppedImage: '',
                        preveiwImage: ''
                    })
                    this.closeModal()
                    dept = null;
                    console.log('Problem Saved in Database')
                }).catch(err => {
                    console.error(err);
                })
        } else {
            alert('department name does not match with our department')
        }





    }

    displayDepartments = departments => (
        this.state.departments.length > 0 && departments.map(dept => {
            return <Menu.Item
                key={dept.id}
                name={dept.department}
                style={{ opacity: 0.7, paddingLeft: '1.5rem' }}
                onClick={() => this.changeDepartment(dept)}
                active={dept.id === this.state.department}
            >
                # {dept.name}
            </Menu.Item>
        })
    )


    changeDepartment = department => {
        console.log(department.id)
        this.props.setProblemDept(true);
        this.props.setProblemDepartmentId(department.id);
        this.props.setCurrentDepartment(department);
        this.setActiveDepartment(department);

    }
    setActiveDepartment = department => {
        console.log(department.id);
        this.setState({
            activeDepartment: department.id
        })
    }




    render() {
        return (
            <Fragment>
                <Menu.Menu className="menu">
                    <Menu.Item>
                        <span>
                            <Icon name="vk" /> Problems {' '}
                        </span>
                        <Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {/* DISPLthis.state.problemRef */}
                    {this.displayDepartments(this.state.departments)}


                </Menu.Menu>

                <Modal basic open={this.state.modal} onClose={this.closeModal}>
                    <Modal.Header as="h2" >
                        Add Problem
                    </Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <Input
                                    fluid
                                    name="title"
                                    label="Problem Title"
                                    onChange={this.inputChangeHandler}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    name="department"
                                    label="Problem Department"
                                    onChange={this.inputChangeHandler}
                                />
                            </Form.Field>
                            <Form.Field>
                                <TextArea
                                    name="description"
                                    style={{ minHeight: 100 }}
                                    placeholder="Problem Title"
                                    onChange={this.inputChangeHandler}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    name="file"
                                    type="file"
                                    label="Problem Pic"
                                    onChange={this.imageChangeHandler}
                                />
                            </Form.Field>
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column>
                                        <AvatarEditor
                                            ref={node => this.avatarEditor = node}
                                            image={this.state.image}
                                            height={150}
                                            width={150}
                                            border={50}
                                            scale={1.2}
                                            style={{ padding: '1rem auto' }}
                                        />
                                    </Grid.Column>
                                    <Grid.Column>
                                        {this.state.preveiwImage ?
                                            <Image
                                                src={this.state.preveiwImage}
                                                width={110}
                                                height={110}
                                                style={{ padding: '2rem auto' }}
                                            /> : null
                                        }

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Button color="green" onClick={this.croppedImage} inverted>
                                <Icon name="image" />
                                Preveiw Image
                            </Button>

                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="green" inverted
                            onClick={this.uploadProblem}
                        >
                            <Icon name="checkmark" />
                            Submit Problem
                        </Button>
                        <Button
                            color="red" inverted
                            onClick={this.closeModal}
                        >
                            <Icon name="remove" />
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Fragment>
        );
    }
}


export default connect(null, ({ setProblemDept ,setCurrentDepartment ,setProblemDepartmentId }))(Problems);