import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getInterviewTitleApi } from "@/api/interview";
import { IInterViewTitleResData } from "@/types/api";

export const getInterViewTitleList = createAsyncThunk('interView/getInterViewTitleList', async () => {
    const res = await getInterviewTitleApi();
    return res.data;
})

interface IInitialState {
    interViewTitleList: IInterViewTitleResData[][]
}

const initialState: IInitialState = {
    interViewTitleList: []
}


export const interViewSlice = createSlice({
    name: "interView",
    initialState,
    reducers: {
        initialInterViewList: (state, { payload }) => {
            state.interViewTitleList = payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getInterViewTitleList.fulfilled, (state, action) => {
            state.interViewTitleList = action.payload;
        })
    }
});

export const { initialInterViewList } = interViewSlice.actions

export default interViewSlice.reducer