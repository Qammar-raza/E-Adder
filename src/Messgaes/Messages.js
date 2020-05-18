import React, { Component, Fragment } from 'react';
import { Segment, Comment, Modal } from 'semantic-ui-react';
import MessageHeader from './MessageHeader';
import MessageForm from './MessagesForm';
import Message from './Message';
import firebase from '../firebase';
import ProblemShow from './ProblemShow';
import { connect } from 'react-redux'
import { setProblemDept, setProblemDepartmentId } from '../Actions/action';


class Messages extends Component {


    state = {
        messagesRef: firebase.database().ref('messages'),
        problemRef: firebase.database().ref('problems'),
        department: this.props.currentDepartment,
        user: this.props.currentUser,
        messages: [],
        departmentMembers: '',
        loadingMessages: true,
        isProblem: this.props.problemDepartment,
        specificDepartmentProblems: []
    }

    componentDidMount() {
        if (this.state.department && this.state.user) {
            this.addListener(this.state.department.id);
        }
    }
    addListener = departmentId => {
        this.addMessageLiastener(departmentId);
        this.problemCalculate();
    }

    problemCalculate = () => {
        let loadedProblems = [];
        if (this.props.problemDepartmentId) {

            this.state.problemRef
                .child(this.props.problemDepartmentId)
                .on("child_added", snap => {
                    loadedProblems.push(snap.val());
                    this.setState({ specificDepartmentProblems: loadedProblems });
                })
        }
    }





    addMessageLiastener = departmentId => {
        let loadedPost = []
        this.state.messagesRef.child(departmentId)
            .on("child_added", snap => {
                console.log(snap.val());
                loadedPost.push(snap.val());
                this.setState({
                    messages: loadedPost,
                    loadingMessages: false
                })
                this.countUniqueUsers(loadedPost)

            })
    }
    countUniqueUsers = loadedPosts => {
        const uniqueUsers = loadedPosts.reduce((acc, post) => {
            if (!acc.includes(post.user.name)) {
                acc.push(post.user.name)
            }
            return acc;
        }, []);

        const numOfUsers = `${uniqueUsers.length} Users`;
        this.setState({
            departmentMembers: numOfUsers
        })
    }

    displayDepartment = dept => dept ? `${dept.name}` : '';

    displayPosts = () => {
        const { specificDepartmentProblems } = this.state;
        return this.props.problemDepartment ?
            <Modal
                basic
                open={this.props.problemDepartment}
                onClose={() => this.setProblemDepat(false, '')}
                centered
            >
                <Modal.Header as="h2" style={{textAlign : 'center'}}>
                    Department Problems
                </Modal.Header>
                {specificDepartmentProblems && specificDepartmentProblems.map(prob => (
                    <ProblemShow
                        pic ={prob.picture}
                        details={prob.description}
                        title={prob.title}
                    />
                ))}
            </Modal>

            : (
                <Comment.Group className="messages">
                    {this.state.messages.length > 0 && this.state.messages.map(message => (
                        <Message
                            key={message.timestamp}
                            message={message}
                            user={this.state.user}
                        />
                    ))}
                </Comment.Group>
            )
    }
    setProblemDepat = (isProblemDept, problemDeptId) => {
        this.props.setProblemDept(isProblemDept);
        this.props.setProblemDepartmentId(problemDeptId);
    }

    render() {
        console.log(this.props.problemDepartmentId);

        return (
            <Fragment>
                <MessageHeader
                    departmentName={this.displayDepartment(this.state.department)}
                    uniqueUsers={this.state.departmentMembers}
                />
                <Segment>
                    {this.displayPosts()}
                </Segment>
                <Segment>
                    <MessageForm
                        messagesRef={this.state.messagesRef}
                        departmentId={this.state.department}
                        currentUser={this.state.user}
                    />
                </Segment>
            </Fragment>
        )
    }
}


export default connect(null, { setProblemDept, setProblemDepartmentId })(Messages);