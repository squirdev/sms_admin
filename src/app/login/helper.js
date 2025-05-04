export const validationSignIn = (username, password) => {
  if (username == "" || password == "") {
    return {
      result: false,
      message: "Please input all information.",
    };
  } else
    return {
      result: true,
      message: "",
    };
};
