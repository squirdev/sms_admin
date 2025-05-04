import axiosApi from "../../../utils/axios";

export const getSms = async (startDate, endDate) => {
  try {
    if (!startDate || !endDate) {
      startDate = "";
      endDate = "";
    }
    const response = await axiosApi.get(
      "/admin/sms?startDate=" + startDate + "&endDate=" + endDate
    );
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
