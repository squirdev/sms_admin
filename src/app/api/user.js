import axiosApi from "../../../utils/axios";

export const signin = async (username, password) => {
  try {
    const response = await axiosApi.post("/admin/auth", {
      username: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const getUserList = async (page, limit, search) => {
  try {
    if (!page || !limit || !search) {
      page = "";
      limit = "";
      search = "";
    }
    const response = await axiosApi.get(
      `/admin/user?page=${page}&limit=${limit}&search=${search}`
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export const getUserAll = async () => {
  try {
    const response = await axiosApi.get(`/admin/user/all`);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const newUser = async ({
  username,
  password,
  content,
  priceH,
  priceC,
  priceM,
  percent,
}) => {
  try {
    const response = await axiosApi.post("/admin/user", {
      username,
      password,
      content,
      priceH,
      priceC,
      priceM,
      percent,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const updateUser = async (id, data) => {
  try {
    const response = await axiosApi.put(`/admin/user/${id}`, data);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const deposit = async (id, usdt) => {
  try {
    const response = await axiosApi.put(`/admin/user/deposit/${id}`, {
      usdt: usdt,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const getUSDTLog = async (id) => {
  try {
    const response = await axiosApi.get(`/admin/user/deposit/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const getSMSLog = async (id) => {
  try {
    const response = await axiosApi.get(`/admin/user/sms/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};
