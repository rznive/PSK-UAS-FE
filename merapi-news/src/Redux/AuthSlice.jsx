    import { createSlice } from "@reduxjs/toolkit"

    const AuthSlice = createSlice({
        name: "auth",
        initialState: {
            token: null,
        },
        reducers: {
            login: (state, action) => {
                state.token = action.payload.token;
            },
            logout: (state) => {
                state.token = null;
            }
        }
    });

    export const { login, logout } = AuthSlice.actions;
    export default AuthSlice.reducer;