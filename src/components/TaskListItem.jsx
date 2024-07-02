import React from 'react';
import { Button, Checkbox, TextInput } from "@carbon/react";
import { Close, Edit, CheckmarkOutline } from '@carbon/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskListItem = ({ props , editIndex, editTaskName, setEditTaskName, saveTask, editTask, removeTask, toggleTask }) => {
    let {task, index} = props

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex',
        alignItems: 'center',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 9999 : 'auto',
        background: isDragging ? '#f0f0f0' : 'white',
        border: isDragging ? '1px solid #ccc' : 'none',
        boxShadow: isDragging ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
        padding: '10px',
        margin: '5px 0'
    };

    const handleEditClick = () => {
        editTask(index); // Invoke editTask function with the index
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            
            <Checkbox
                id={`checkbox-${task.id}`}
                className="checkbox"
                checked={task.isFinished}
                labelText={task.name}
                onChange={() => toggleTask(index)}
            />
            {editIndex === index ? (
                <>
                    <TextInput
                        id={`edit-task-${task.id}`}
                        labelText=""
                        value={editTaskName}
                        onChange={(e) => setEditTaskName(e.target.value)}
                    />
                    <Button kind="ghost" iconDescription="Save" hasIconOnly renderIcon={CheckmarkOutline} onClick={() => saveTask(index)} />
                </>
            ) : (
                <>
                    <Button kind="ghost" iconDescription="Edit" hasIconOnly renderIcon={Edit} onClick={handleEditClick} />
                    <Button kind="ghost" iconDescription="Remove" hasIconOnly renderIcon={Close} onClick={() => removeTask(index)} />
                </>
            )}
        </div>
    );
}

export default TaskListItem;
