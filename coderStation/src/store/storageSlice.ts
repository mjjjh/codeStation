import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
    // issue页状态
    issuePage: {
        current: number,
        pageSize: number,
        totalPage: number,
        typeId?: string
    },

    // book页状态
    bookPage: {
        current: number,
        pageSize: number,
        totalPage: number,
        typeId?: string
    }
}


const initialState: IInitialState = {
    issuePage: {
        current: 1,
        pageSize: 10,
        totalPage: 0
    },
    bookPage: {
        current: 1,
        pageSize: 10,
        totalPage: 0
    },

}

export const storageSlice = createSlice({
    name: "type",
    initialState,
    reducers: {
        storeIssuePage: (state, { payload }) => {
            state.issuePage = payload
        },
        storeBookPage: (state, { payload }) => {
            state.bookPage = payload
        }
    },
})

export const { storeIssuePage, storeBookPage } = storageSlice.actions
export default storageSlice.reducer