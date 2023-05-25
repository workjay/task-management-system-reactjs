export const errorHandler = (err = "") => {
  return {
    status: false,
    message: err?.message || "Something went wrong! Please try after sometime.",
  };
};

export const replacePathParams = (url = "", obj = {}) => {
  for (let [key, value] of Object.entries(obj)) {
    url = url?.replace(`{${key}}`, value);
  }
  return url;
};
