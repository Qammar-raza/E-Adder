import * as actionType from '../Actions/actionType';
import {combineReducers} from 'redux';

const initialUserState = {
    currentUser : null,
    loading : true
}

const user_reducer = (state = initialUserState , action) =>{
    
    switch(action.type){
        case actionType.SET_CURRENT_USER :
            return {
                currentUser : action.payload.currentUser,
                loading : false
            }
        case actionType.CLEAR_USER :
            return {
                ...state,
                loading : false
            }
        default : 
            return state
    }

}

const initialDepartmentState = {
    currentDepartment : null,
    problemDepartment : false,
}


const department_reducer = (state = initialDepartmentState ,action) =>{

    switch(action.type){
        case actionType.SET_CURRENT_DEPARTMENT :
            return {
                ...state,
                currentDepartment : action.payload.currentDepartment
            }
        case actionType.SET_PROBLEM_DEPARTMENT :
            return {
                ...state ,
                problemDepartment : action.payload.departmentbool
            }
        default :
            return state;
    }
}


const initialProblemDepartmentId = {
    currentDepartmentId : ''
}


const problem_department_reducer = (state = initialProblemDepartmentId , action) =>{
    switch(action.type){
        case actionType.SET_PROBLEM_DEPARTMENT_ID : 
            return {
                ...state ,
                currentDepartmentId : action.payload.problemDepartmentId
            }
        default :
            return state
    }
}


const RootReducer = combineReducers({
    user : user_reducer,
    department : department_reducer,
    problem : problem_department_reducer,
});

export default RootReducer;