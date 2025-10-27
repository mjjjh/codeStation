import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        isLogin: false,
        userInfo: {
            _id: '',
            avatar: '',
            nickname: ''
        }
    },
    reducers: {
        initialUserInfo: (state, { payload }) => {
            state.userInfo = payload;
        },
        changeLoginStatus: (state, { payload }) => {
            state.isLogin = payload;
        },
        clearUserInfo: (state) => {
            state.isLogin = false;
            state.userInfo = {
                _id: '',
                avatar: '',
                nickname: ''
            };
        }
    }
});

export const { initialUserInfo, changeLoginStatus, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;