import {useSelector} from 'react-redux';
import { useDispatch } from 'react-redux';
import { deleteTodo, changeTodo } from '../redux/todolistSlice';
function List(){
    const {todoList} = useSelector(state => state.todo);
    const dispatch = useDispatch();
    const list = todoList.map((item, index) => {
        return (<li key={index} className="card m-2">
            <span className='card-title'>{item.name}</span>
            <span className='card-text btn btn-primary mb-2' onClick={() => {dispatch(deleteTodo(index))}}>x</span>
            <span className={['btn',item.status ? 'btn-primary' : 'btn-light'].join(' ')} onClick={() => dispatch(changeTodo(index))}>{item.status ? '已完成' : '未完成'}</span>
        </li>);
    })

    return (
        <div className="container d-flex">
            {list}
        </div>
    )
}

export default List;