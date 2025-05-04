import axiosApi from "../../../utils/axios";

export const getAllDeposit = async (startDate, endDate) => {
  try {
    if (!startDate || !endDate) {
      startDate = "";
      endDate = "";
    }
    const response = await axiosApi.get(
      "/admin/payment/deposit?startDate=" + startDate + "&endDate=" + endDate
    );
    return response;
  } catch (error) {
    return error;
  }
};
