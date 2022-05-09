import React, { useEffect, useState } from 'react'
import todolist from './todolist.css'
import Axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { addTaskApi, delTaskApi, getTaskListApi } from '../../redux/actions/ToDoListAction';

export default function Todolist() {
    const dispatch = useDispatch();
    const { taskList } = useSelector((state) => state.ToDoListReducer);
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
        dispatch(getTaskListApi())
    }

    // Call API
    useEffect(() => {
        getTaskList()
    }, [])

    // ADD_TASK
    const addTask = () => {
        dispatch(addTaskApi(state.values.taskName))
    }

    // DELETE_TASK
    const delTask = (taskName) => {
        console.log(taskName)
        dispatch(delTaskApi(taskName))
    }

    const doneTask = () => {

    }

    const renderTaskToDo = () => {
        const res = taskList.filter(item => !item.status).map((item, index) => {
            return (
                <li key={index}>
                    <span>{item.taskName}</span>
                    <div className="buttons">
                        <button className="remove" onClick={() => delTask(item.taskName)}>
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
        const res = taskList.filter(item => item.status).map((item, index) => {
            return (
                <li key={index}>
                    <span>{item.taskName}</span>
                    <div className="buttons">
                        <button className="remove">
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
        <div>
            <div className="card">
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
    )
}
