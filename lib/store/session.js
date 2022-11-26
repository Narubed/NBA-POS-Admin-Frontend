import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    token: "",
    user: null,
    loading: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      if (state.token && state.token.length > 0) {
        localStorage.setItem("jwt", state.token);
      } else {
        localStorage.removeItem("jwt");
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetAll: (state, action) => {
      state.user = null;
      state.token = "";
      localStorage.removeItem("jwt");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setToken, setUser, resetAll, setLoading } = sessionSlice.actions;

export default sessionSlice.reducer;
