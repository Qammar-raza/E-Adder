import React, { Component, Fragment } from 'react'
import { Menu, Icon, Modal, Button, Form, Input } from 'semantic-ui-react';
import {connect} from 'react-redux';
import firebase from '../firebase';
import {setCurrentDepartment ,setProblemDept} from '../Actions/action'

class Department extends Component {
    state = {
        user : this.props.currentUser ,
        departmentRef : firebase.database().ref('departments'),
        departments: [],
        deptName: '',
        deptHOD: '',
        firstTimeLoad : true,
        department : null,
        activeDepartment : '',
        modal: false
    }


    componentDidMount () {
        this.addListener()
    }
    addListener = () =>{
        let loadedPosts = [];
        this.state.departmentRef.on("child_added" , snap=>{
            console.log(snap.val());
            loadedPosts.push(snap.val());
            this.setState({
                departments : loadedPosts
            })
            // }, () =>this.setFirstChannel())
        })
    }

    setFirstChannel = () =>{
        const firstDepartment = this.state.departments[0];
        console.log(firstDepartment);
        if(this.state.firstTimeLoad && this.state.departments.length > 0){
            this.props.setCurrentDepartment(firstDepartment);
            this.setActiveDepartment(firstDepartment);
            
        }
        this.setState({
            firstTimeLoad : false
        })
    }
    setActiveDepartment = department =>{
        console.log(department.id);
        this.setState({
            activeDepartment : department.id
        })
    }


    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    formSubmitHandler = event =>{
        event.preventDefault();
        if(this.isFormValid(this.state)){
            this.addDepartment()
        }

    }

    isFormValid =({deptName , deptHOD}) =>{
        return deptName && deptHOD;
    }
    addDepartment = () =>{
        const {departmentRef , deptName ,deptHOD , user } =this.state;
        
        let key=departmentRef.push().key;
        console.log(key);
        
        const newDept ={
            id : key,
            name : deptName,
            hod : deptHOD,
            createdBy : {
                name : user.displayName,
                avatar : user.photoURL
            }
        }

        departmentRef
            .child(key)
            .update(newDept)
            .then(()=>{
                this.setState({
                    deptName : '',
                    deptHOD : '',
                })
                this.closeModal();
                console.log('Channel Added stored in Database ');
            }).catch(err=>{
                console.log(err)
            })

    }

    displayDepartments = departments =>(
        departments.length > 0 && departments.map(dept =>(
             <Menu.Item
                        key={dept.id}
                        name={dept.name}
                        style={{opacity : 0.7 , paddingLeft : '1.5rem'}}
                        active={dept.id === this.state.activeDepartment}
                        onClick={()=>this.changeDepartment(dept)}
                >
                # {dept.name}
            </Menu.Item>
        ))
    )

    changeDepartment = department =>{
        // console.log(department)
        this.props.setCurrentDepartment(department);
        this.setActiveDepartment(department);
        this.props.setProblemDept(false);

    }

    render() {
        return (
            <Fragment>
                <Menu.Menu className="menu">
                    <Menu.Item>
                        <span>
                            <Icon name="paw" /> DEPT
                        </span>{' '}
                        ({this.state.departments.length})
                        <Icon onClick={this.openModal} name="add" />
                    </Menu.Item>
                    
                    {/* DISPLAY CHANNELS */}
                    {this.displayDepartments(this.state.departments)}
                    
                </Menu.Menu>
                <Modal basic open={this.state.modal} onClose={this.closeModal}>
                    <Modal.Header as="h2" >
                        Add Department
                    </Modal.Header>
                    <Modal.Content>
                        <Form onSubmit ={this.formSubmitHandler}>
                            <Form.Field>
                                <Input
                                    name="deptName"
                                    label="Name of Department"
                                    fluid
                                    onChange={this.inputChangeHandler}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    name="deptHOD"
                                    label="Head of Department"
                                    fluid
                                    onChange={this.inputChangeHandler}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" onClick={this.formSubmitHandler} inverted>
                            <Icon name="checkmark" />Add
                        </Button>
                        <Button color="red" onClick={this.closeModal} inverted>
                            <Icon name="remove" />Cancel
                        </Button>
                    </Modal.Actions>

                </Modal>
            </Fragment>
        );
    }
}





export default connect(null ,{setCurrentDepartment , setProblemDept})( Department);