import { addPosts } from "./toolkitSlice";

export const fetchPosts = () => {
  return (dispatch) => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => dispatch(addPosts(json)));
  };
};
