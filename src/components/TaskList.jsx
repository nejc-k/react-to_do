import React, { useState, useEffect } from "react";
import { ContainedList, Button, ContainedListItem, Checkbox, TextInput } from "@carbon/react";
import { Add, Close, Edit, CheckmarkOutline } from '@carbon/icons-react';

class Task {
    constructor(name, isFinished = false) {
        this.name = name;
        this.isFinished = isFinished;
    }
}

const TaskList = () => {
    const [taskList, setTaskList] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        parsedTasks.map(task => new Task(task.name, task.isFinished));
        return parsedTasks
    }
    return []
    
});
    const [newTaskName, setNewTaskName] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [editTaskName, setEditTaskName] = useState("");


    useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    console.log('Loaded tasks: ', savedTasks);
    if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTaskList(parsedTasks.map(task => new Task(task.name, task.isFinished)));
    }
    }, []);


    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (savedTasks) {
            setTaskList(savedTasks);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }, [taskList]);

    const addTask = () => {
        if (newTaskName.trim()) {
            setTaskList([...taskList, new Task(newTaskName)]);
            setNewTaskName("");
        }
    };

    const removeTask = (index) => {
        const updatedTasks = taskList.filter((_, i) => i !== index);
        setTaskList(updatedTasks);
    };

    const editTask = (index) => {
        setEditIndex(index);
        setEditTaskName(taskList[index].name);
    };

    const saveTask = (index) => {
        const updatedTasks = taskList.map((task, i) => i === index ? new Task(editTaskName, task.isFinished) : task);
        setTaskList(updatedTasks);
        setEditIndex(null);
        setEditTaskName("");
    };

    const toggleTask = (index) => {
        const updatedTasks = taskList.map((task, i) => i === index ? new Task(task.name, !task.isFinished) : task);
        setTaskList(updatedTasks);
    };

    return (
        <div className="taskList">
            <ContainedList
                label="Task List"
                action={
                    <>
                        <TextInput
                            id="new-task"
                            labelText=""
                            placeholder="New task"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                        />
                        <Button hasIconOnly iconDescription="Add" renderIcon={Add} tooltipPosition="left" onClick={addTask} />
                    </>
                }
            >
                {taskList.map((task, i) => (
                    <ContainedListItem
                        className="taskListItem"
                        key={i}
                        action={
                            <>
                                <Checkbox
                                    id={`checkbox-${i}`}
                                    className="checkbox"
                                    checked={task.isFinished}
                                    labelText={task.name}
                                    onChange={() => toggleTask(i)}
                                   
                                />
                                {editIndex === i ? (
                                    <>
                                        <TextInput
                                            id={`edit-task-${i}`}
                                            labelText=""
                                            value={editTaskName}
                                            onChange={(e) => setEditTaskName(e.target.value)}
                                        />
                                        <Button kind="ghost" iconDescription="Save" hasIconOnly renderIcon={CheckmarkOutline} onClick={() => saveTask(i)} />
                                    </>
                                ) : (
                                    <>
                                        <Button kind="ghost" iconDescription="Edit" hasIconOnly renderIcon={Edit} onClick={() => editTask(i)} />
                                        <Button kind="ghost" iconDescription="Remove" hasIconOnly renderIcon={Close} onClick={() => removeTask(i)} />
                                    </>
                                )}
                            </>
                        }
                    >
                    </ContainedListItem>
                ))}
            </ContainedList>
        </div>
    );
};

export default TaskList;
