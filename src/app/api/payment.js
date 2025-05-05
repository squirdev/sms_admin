import axiosApi from "../../../utils/axios";

export const getAllDeposit = async (date) => {
  try {
    if (!date) {
      date = "";
    }
    const response = await axiosApi.get("/admin/payment/deposit?date=" + date);
    return response;
  } catch (error) {
    return error;
  }
};
