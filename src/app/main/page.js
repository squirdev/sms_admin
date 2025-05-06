"use client";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice";
import { getAllDeposit } from "../api/payment";
import { getBalance, getSms } from "../api/sms";
import DatePicker from "../components/datePicker";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchDate, setSearchDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalSMS, setTotalSMS] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [balance, setBalance] = useState([]);

  const fetchAllRecharge = async () => {
    const result = await getAllDeposit(searchDate);
    if (result.status === 401) {
      dispatch(logout());
      router.push("/login");
      return;
    }
    if (result.status === 200) {
      let total = result.data.reduce((sum, data) => sum + data.amount, 0);
      setTotalDeposit(total);
      return;
    }
  };

  const fetchTotalProfit = async () => {
    const result = await getSms(searchDate);
    if (result.status === 401) {
      dispatch(logout());
      router.push("/login");
      return;
    }
    if (result.status === 200) {
      let response = result.data;
      let entireSMS = response.reduce((sum, data) => sum + data.totalCount, 0);
      setTotalSMS(entireSMS);
      let entireProfit = response.reduce(
        (sum, data) =>
          sum +
          (data?.userId?.isTestUser ? 0 : data.totalCount * data.userPerPrice) -
          data.sendCount * data.sysPerPrice,
        0
      );
      setTotalProfit(entireProfit);
      return;
    }
  };

  const fetchRemainBalance = async () => {
    const result = await getBalance();
    if (result.status === 401) {
      dispatch(logout());
      router.push("/login");
      return;
    }
    if (result.status === 200) {
      setBalance(result.data);
      return;
    }
  };

  useEffect(() => {
    fetchRemainBalance();
  }, []);

  useEffect(() => {
    fetchAllRecharge();
    fetchTotalProfit();
  }, [searchDate]);
  return (
    <div className="p-10 flex flex-col w-full h-full">
      <div className="border-white bg-gray-200 border-2 rounded-md p-1 mb-5 w-full">
        <DatePicker searchDate={searchDate} setSearchDate={setSearchDate} />
      </div>
      <div className="flex flex-col gap-6 py-8">
        <div className="flex gap-4">
          <Typography variant="h3">Total SMS Delivery Amount:</Typography>
          <Typography variant="h3">{totalSMS}</Typography>
        </div>
        <div className="flex gap-4">
          <Typography variant="h3">Total Recharge Amount:</Typography>
          <Typography variant="h3">${totalDeposit}</Typography>
        </div>
        <div className="flex gap-4">
          <Typography variant="h3">Total Profit:</Typography>
          <Typography variant="h3">${totalProfit.toFixed(3)}</Typography>
        </div>
        <div className="flex gap-4">
          <Typography variant="h3">Remain Balance:</Typography>
          <div className="flex flex-col gap-4">
            {balance &&
              balance.map((value, index) => (
                <Typography key={index} variant="h3">
                  Network{index + 1}: ${value}
                </Typography>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
