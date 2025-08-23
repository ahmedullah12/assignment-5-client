import { createSlice } from "@reduxjs/toolkit";

export type TUser = {
    email: string;
    name: string;
    role: string;
    iat: number;
    exp: number;
    sub: string;
}

type TInitialState = {
    user: null | TUser;
    token: null | string;
}

const initialState: TInitialState = {
    user: null,
    token: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const {user, token} = action.payload;
            state.user = user;
            state.token = token;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        }
    }
});


export const {setUser, logOut} = authSlice.actions;
export default authSlice.reducer;