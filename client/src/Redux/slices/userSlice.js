import { createSlice } from "@reduxjs/toolkit";
// two packages are used to use redux in project @reduxjs/toolkit, react-redux -> useSelector, useDispatch


const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    markAllRead: (state) => {
      state.user.notification = []
    },
  },
});

export const { setUser,markAllRead } = userSlice.actions;
export default userSlice.reducer;
