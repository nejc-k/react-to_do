import { HeaderName} from '@carbon/react';
import TaskList from '../components/TaskList';
const MainPage = ()=>{

    return (<>
    <HeaderName prefix="">To Do</HeaderName>
    
    <div className='container'>
    <TaskList/>
    </div>
    </>)


}

export default MainPage