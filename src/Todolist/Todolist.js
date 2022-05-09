import React, { useEffect, useState } from 'react'
import todolist from './todolist.css'
import Axios from 'axios'
export default function Todolist() {
    const [state, setState] = useState({
        taskList: [],
        values: {
            taskName: ''
        },
        errors: {
            taskName: ''
        }
    })

    const handleChange = (e) => {
        let { value } = e.target

        let newValue = { ...state.values }
        newValue.taskName = value

        let newError = { ...state.errors }
        let regexString = /^[a-z A-Z]+$/;
        if (!regexString.test(value) || value.trim() === '') {
            newError.taskName = 'TaskName invalid !';
        } else {
            newError.taskName = '';
        }

        setState({
            ...state,
            values: newValue,
            errors: newError
        })
    }

    const getTaskList = () => {
        let promise = Axios({
            url: 'http://svcy.myclass.vn/api/ToDoList/GetAllTask',
            method: 'GET'
        })

        promise.then(result => {
            setState({ ...state, taskList: result.data })
        })

        promise.catch(err => {
            console.log(err.response.data)
        })
    }

    // Call API
    useEffect(() => {
        getTaskList()
    }, [])

    // ADD_TASK
    const addTask = () => {
        if (state.errors.taskName !== '') {
            setState({ ...state, errors: { taskName: 'Do not enter numbers and characters with accents EX: Taskname' } })
        } else {
            let promise = Axios({
                url: 'http://svcy.myclass.vn/api/ToDoList/AddTask',
                method: 'POST',
                data: {
                    taskName: state.values.taskName
                }
            })
            promise.then((result) => {
                setState({ ...state, errors: { taskName: '' } })
                getTaskList()
            })
            promise.catch((errors) => {
                console.log(errors.response.data)
                let newError = { ...state.errors }
                newError.taskName = errors.response.data
                setState({
                    ...state,
                    errors: newError
                })
            })
        }

    }

    // DELETE_TASK
    const delTask = (task) => {
        let promise = Axios({
            url: `http://svcy.myclass.vn/api/ToDoList/deleteTask?taskName=${task.taskName}`,
            method: 'DELETE'
        })
        promise.then(() => {
            getTaskList()
        })
        promise.catch((errors) => {
            console.log(errors.response.data)
        })
    }

    const doneTask = (task) => {
        let promise = Axios({
            url: `http://svcy.myclass.vn/api/ToDoList/doneTask?taskName=${task.taskName}`,
            method: 'PUT'
        })
        promise.then(() => {
            getTaskList()
        })
        promise.catch((errors) => {
            console.log(errors.response.data)
        })
    }

    const renderTaskToDo = () => {
        const res = state.taskList.filter(item => !item.status).map((item, index) => {
            return (
                <li key={index}>
                    <span>{item.taskName}</span>
                    <div className="buttons">
                        <button className="remove" onClick={() => delTask(item)}>
                            <i className="fa fa-trash-alt" />
                        </button>
                        <button className="complete " onClick={() => doneTask(item)}>
                            <i className="far fa-check-circle" />
                            <i className="fas fa-check-circle" />
                        </button>
                    </div>
                </li>
            )
        })
        return res
    }

    const renderTaskComplete = () => {
        const res = state.taskList.filter(item => item.status).map((item, index) => {
            return (
                <li key={index}>
                    <span>{item.taskName}</span>
                    <div className="buttons">
                        <button className="remove" onClick={() => delTask(item)}>
                            <i className="fa fa-trash-alt" />
                        </button>
                        <button className="complete">
                            <i className="far fa-check-circle" />
                            <i className="fas fa-check-circle" />
                        </button>
                    </div>
                </li>
            )
        })
        return res
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className="card col-lg-7 col-md-10 col-sm-10 text-center ">
                    <div className="card__header">
                        <img src={require('./bg.png')} />
                    </div>
                    <div className="card__body">
                        <div className="card__content">
                            <div className="card__title">
                                <h2>My Tasks</h2>
                                <p>September 9,2020</p>
                            </div>
                            <div className="card__add">
                                <input id="newTask" type="text" placeholder="Enter an activity..." onChange={handleChange} />
                                <button id="addItem" onClick={addTask}>
                                    <i className="fa fa-plus" />
                                </button>
                            </div>
                            <p style={{ color: 'red', paddingBottom: '0' }}>{state.errors.taskName}</p>
                            <div className="card__todo">
                                {/* Uncompleted tasks */}
                                <ul className="todo" id="todo">
                                    {renderTaskToDo()}
                                </ul>
                                {/* Completed tasks */}
                                <ul className="todo" id="completed">
                                    {renderTaskComplete()}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
