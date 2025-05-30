import axios from "axios";

const instance = axios.create({
  baseURL: "https://math4jem-default-rtdb.firebaseio.com/",
});

export default instance;