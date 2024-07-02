import React, { useState, useEffect } from "react";
import { ContainedList, Button, TextInput } from "@carbon/react";
import { Add } from '@carbon/icons-react';
import TaskListItem from "./TaskListItem";
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';

class Task {
    constructor(name, isFinished = false) {
        this.id = uuidv4(); // Generate a unique ID for each task
        this.name = name;
        this.isFinished = isFinished;
    }
}

const TaskList = () => {
    const [taskList, setTaskList] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            return parsedTasks.map(task => ({ ...task, id: task.id || uuidv4() })); // Ensure each task has a unique ID
        }
        return [];
    });
    const [newTaskName, setNewTaskName] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [editTaskName, setEditTaskName] = useState("");
    const [activeId, setActiveId] = useState(null);

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
        const updatedTasks = taskList.map((task, i) => i === index ? { ...task, name: editTaskName } : task);
        setTaskList(updatedTasks);
        setEditIndex(null);
        setEditTaskName("");
    };

    const toggleTask = (index) => {
        const updatedTasks = taskList.map((task, i) => i === index ? { ...task, isFinished: !task.isFinished } : task);
        setTaskList(updatedTasks);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over.id) {
            setTaskList((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
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
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={taskList.map(task => task.id)} strategy={verticalListSortingStrategy}>
                        {taskList.map((task, index) => (
                            <TaskListItem
                                key={task.id}
                                props={{ task, index }}
                                toggleTask={() => toggleTask(index)}
                                editIndex={editIndex}
                                editTaskName={editTaskName}
                                setEditTaskName={setEditTaskName}
                                saveTask={() => saveTask(index)}
                                editTask={() => editTask(index)}
                                removeTask={() => removeTask(index)}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {activeId !== null ? (
                            <div style={{
                                padding: '16px',
                                backgroundColor: 'white',
                                border: '1px solid black',
                                borderRadius: '4px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                transform: 'scale(1.05)',
                                transition: 'transform 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'grabbing',
                                opacity: 0.8
                            }}>
                                {taskList.find(task => task.id === activeId)?.name}
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </ContainedList>
        </div>
    );
};

export default TaskList;
