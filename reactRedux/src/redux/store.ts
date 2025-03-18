import {configureStore} from '@reduxjs/toolkit'
import todolistReducer from './todolistSlice'

export const store = configureStore({
    reducer:{
        todo: todolistReducer
    }
});



export default store