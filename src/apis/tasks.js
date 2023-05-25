import { errorHandler, replacePathParams } from "../utils";
import ENDPOINTS from "./endpoints";
import axios from "axios";

let headers = {
  "Content-Type": "application/json",
};

export const getTasksApi = async (query = {}) => {
  return await axios
    .get(`${process.env.REACT_APP_API_BASE_URL}${ENDPOINTS.TASKS.GET}`, {
      headers,
      params: query,
    })
    .then((res) => res?.data)
    .catch(errorHandler);
};

export const createTaskApi = async (body = {}) => {
  return await axios
    .post(
      `${process.env.REACT_APP_API_BASE_URL}${ENDPOINTS.TASKS.POST}`,
      body,
      { headers }
    )
    .then((res) => res?.data)
    .catch(errorHandler);
};

export const updateTaskApi = async (id = "", body = {}) => {
  return await axios
    .put(
      replacePathParams(
        `${process.env.REACT_APP_API_BASE_URL}${ENDPOINTS.TASKS.PUT}`,
        {
          id,
        }
      ),
      body,
      { headers }
    )
    .then((res) => res?.data)
    .catch(errorHandler);
};

export const deleteTaskApi = async (id = "") => {
  return await axios
    .delete(
      replacePathParams(
        `${process.env.REACT_APP_API_BASE_URL}${ENDPOINTS.TASKS.DELETE}`,
        { id }
      ),
      {
        headers,
      }
    )
    .then((res) => res?.data)
    .catch(errorHandler);
};
