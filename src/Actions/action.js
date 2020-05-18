import * as actionType from './actionType';


    // USER ACTIONS

export const setUser = user =>{
    return{
        type : actionType.SET_CURRENT_USER,
        payload : {
            currentUser : user
        }
    }
}
export const clearUser = () =>{
    return {
        type : actionType.CLEAR_USER
    }
}

    // DEPARTMENT ACTIONS


export const setCurrentDepartment = department =>{
    return {
        type : actionType.SET_CURRENT_DEPARTMENT,
        payload : {
            currentDepartment : department
        }
    }
}

export const setProblemDept = (departmentbool , probDeptId) =>{
    return {
        type : actionType.SET_PROBLEM_DEPARTMENT,
        payload : {
            departmentbool :departmentbool,
            probDeptId : probDeptId

        }
    }
}


export const setProblemDepartmentId = problemDepartmentId =>{
    return{
        type : actionType.SET_PROBLEM_DEPARTMENT_ID,
        payload : {
            problemDepartmentId : problemDepartmentId
        }
    }
}