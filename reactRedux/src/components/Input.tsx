import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../redux/todolistSlice";
function Input() {
    const [value, setValue] = useState("");
    const dispatch = useDispatch();
    return (
        <div className="input-group">
            <input
                type="text"
                className="form-control"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button className="btn btn-primary" onClick={(e) => {dispatch(addTodo(value));setValue("")}}>提交</button>
        </div>
    );
}

export default Input;