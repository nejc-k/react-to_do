
import { ContainedList, Button, ContainedListItem, Checkbox, TextInput } from "@carbon/react";
import { Add, Close, Edit, CheckmarkOutline } from '@carbon/icons-react';
const TaskListItem = ({props, toggleTask, editIndex, editTaskName, setEditTaskName, saveTask, editTask, removeTask})=>{
    var task= props.task;
    var i = props.i;

    return <ContainedListItem
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

}

export default TaskListItem