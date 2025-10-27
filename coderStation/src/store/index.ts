import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import typeSlice from "./typeSlice";
import storageSlice from "./storageSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        type: typeSlice,
        storage: storageSlice
    },
});

// 定义根状态类型
export type RootState = ReturnType<typeof store.getState>;

// 定义 dispatch 类型（支持 thunk）
export type AppDispatch = typeof store.dispatch;


export default store;