import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getType } from "@/api/type";
import { ITypeRes } from "@/types/api";

interface IInitialState {
    typeList: ITypeRes[]
}

export const getTypeList = createAsyncThunk('type/getTypeList', async () => {
    const res = await getType();
    return res.data
})

const initialState: IInitialState = {
    typeList: []
}


export const typeSlice = createSlice({
    name: "type",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getTypeList.fulfilled, (state, action) => {
            state.typeList = action.payload;
        })
    }
})

export default typeSlice.reducer