import axiosApi from "../../../utils/axios";

export const getSms = async (date) => {
  try {
    if (!date) {
      date = "";
    }
    const response = await axiosApi.get("/admin/sms?date=" + date);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const getBalance = async () => {
  try {
    const response = await axiosApi.get("/admin/sms/getBalance");
    return response;
  } catch (error) {
    return error.response;
  }
};
