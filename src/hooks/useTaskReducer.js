import { useReducer } from "react";

const initialState = {
  tasks: [],
  count: 0,
  isLoading: false,
};

const reducer = (state, action) => {
  switch (action?.type) {
    case "updateLoading": {
      return {
        ...state,
        isLoading: action?.payload,
      };
    }
    case "getTasks": {
      return {
        ...state,
        tasks: state?.tasks?.concat(action?.payload?.data),
        count: action?.payload?.count,
      };
    }
    case "addTask": {
      return {
        ...state,
        tasks: [action?.payload, ...state?.tasks],
        count: state?.count + 1,
      };
    }
    case "updateTask": {
      return {
        ...state,
        tasks: state?.tasks?.map((item) =>
          item?._id === action?.payload?._id ? action?.payload : item
        ),
      };
    }
    case "deleteTask": {
      return {
        ...state,
        tasks: state?.tasks?.filter(
          (item) => item?._id !== action?.payload?._id
        ),
        count: state?.count - 1,
      };
    }
    case "clearTasks": {
      return initialState;
    }
    default:
      return state || initialState;
  }
};

export const useTaskReducer = () => useReducer(reducer, initialState);
