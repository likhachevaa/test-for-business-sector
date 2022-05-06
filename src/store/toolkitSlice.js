import { createSlice } from "@reduxjs/toolkit";

const toolkitSlice = createSlice({
  name: "toolkit",
  initialState: {
    posts: [],
  },
  reducers: {
    addPosts(state, action) {
      state.posts = action.payload;
    },
  },
});

export default toolkitSlice.reducer;
export const { addPosts } = toolkitSlice.actions;
