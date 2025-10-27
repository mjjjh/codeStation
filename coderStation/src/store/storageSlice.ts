import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
    // issue页状态
    issuePage: {
        current: number,
        pageSize: number,
        count: number
    }
}


const initialState: IInitialState = {
    issuePage: {
        current: 1,
        pageSize: 10,
        count: 0
    }
}

export const storageSlice = createSlice({
    name: "type",
    initialState,
    reducers: {
        storeIssuePage: (state, { payload }) => {
            state.issuePage = payload
        }
    },
})

export const { storeIssuePage } = storageSlice.actions
export default storageSlice.reducer