import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateUser } from "@/api/user";
import { IUserInfoNew } from "@/types/store";
import { IUserInfo } from "@/types/api";


export const updateUserInfoAsync = createAsyncThunk('user/updateUserInfo', async (payload: IUserInfoNew) => {
    console.log(payload, '积分');

    await updateUser(payload.userid, payload.newInfo);
    return payload.newInfo;
})

let userInfo: IUserInfo = {
    _id: '',
    avatar: '',
    nickname: '',
    points: 0
}

export const userSlice = createSlice({
    name: "user",
    initialState: {
        isLogin: false,
        userInfo
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
                nickname: '',
                points: 0
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(updateUserInfoAsync.fulfilled, (state, { payload }) => {
            Object.entries(payload).forEach(([key, value]) => {
                if (key in state.userInfo) {
                    (state.userInfo as Record<string, unknown>)[key] = value;
                }
            });
        })
    }
});

export const { initialUserInfo, changeLoginStatus, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;