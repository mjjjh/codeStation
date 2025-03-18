import { createSlice } from "@reduxjs/toolkit";

const todolistSlice = createSlice({
    name: "todo",
    initialState: {
        todoList: [{
            name:"learn",
            status: false
        },{
            name: "paly",
            status: false
        }],
    },
    reducers: {
        addTodo: (state, action) => {
            state.todoList.push({
                name: action.payload,
                status: false
            });
        },
        deleteTodo: (state, action) => { 
           state.todoList.splice(action.payload, 1);
        },
        changeTodo: (state, action) => {
            state.todoList[action.payload].status = !state.todoList[action.payload].status;
        },
    },
});

export const { addTodo, deleteTodo, changeTodo } = todolistSlice.actions;
export default todolistSlice.reducer;