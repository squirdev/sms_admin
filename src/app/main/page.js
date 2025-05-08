"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { BsBootstrapReboot } from "react-icons/bs";
import { Typography } from "@material-tailwind/react";

import DatePicker from "../components/datePicker";
import { logout } from "../../../redux/authSlice";
import { getAllDeposit } from "../api/payment";
import { getBalance, getSms } from "../api/sms";
import DefaultSkeleton from "../components/skeleton";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchDate, setSearchDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalSMS, setTotalSMS] = useState(0);
  const [testSMS, setTestSMS] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [balance, setBalance] = useState([]);

  const fetchAllRecharge = async () => {
    try {
      const result = await getAllDeposit(searchDate);
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
      }
      if (result.status === 200) {
        let total = result.data.reduce((sum, data) => sum + data.amount, 0);
        setTotalDeposit(total);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const fetchTotalProfit = async () => {
    try {
      const result = await getSms(searchDate);
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
        return;
      }
      if (result.status === 200) {
        let response = result.data;
        let entireSMS = response.reduce(
          (sum, data) => sum + data.totalCount,
          0
        );
        let testEntireSMS = response.reduce(
          (sum, data) => sum + (data?.userId?.isTestUser ? data.totalCount : 0),
          0
        );
        setTestSMS(testEntireSMS);
        setTotalSMS(entireSMS);
        let entireProfit = response.reduce(
          (sum, data) =>
            sum +
            (data?.userId?.isTestUser
              ? 0
              : data.totalCount * data.userPerPrice) -
            data.sendCount * data.sysPerPrice,
          0
        );
        setTotalProfit(entireProfit);
        return;
      }
    } catch (error) {
      console.log("ERROR", error);
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

  const handleRefreshPage = () => {
    fetchRemainBalance();
    fetchAllRecharge();
    fetchTotalProfit();
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
      <div className="w-full flex flex-col gap-6 py-8 text-gray-900">
        <button
          onClick={handleRefreshPage}
          className="self-end flex items-center gap-1 text-green-500 font-bold"
        >
          <BsBootstrapReboot className="w-5 h-5" />
          <p className="text-lg">重新加载</p>
        </button>
        <div className="flex gap-4">
          <Typography variant="h4">发送量:</Typography>
          <Typography variant="h4">{totalSMS}</Typography>
        </div>
        <div className="flex gap-4 px-8">
          <Typography variant="h5">测试数量:</Typography>
          <Typography variant="h5">{testSMS}</Typography>
        </div>
        <div className="flex gap-4 px-8">
          <Typography variant="h5">客户数量:</Typography>
          <Typography variant="h5">{totalSMS - testSMS}</Typography>
        </div>
        <div className="flex gap-4">
          <Typography variant="h4">充值金额:</Typography>
          <Typography variant="h4">${totalDeposit}</Typography>
        </div>
        <div className="flex gap-4">
          <Typography variant="h4">利润:</Typography>
          <Typography variant="h4">${totalProfit.toFixed(3)}</Typography>
        </div>
        <div className="flex gap-4">
          <Typography variant="h4">API余额:</Typography>
          <div className="flex flex-col gap-4">
            {balance && balance.length == 3 && (
              <>
                <Typography variant="h5">
                  欧美通道（Telegram） : ${balance[0]}
                </Typography>
                <Typography variant="h5">
                  欧美通道(WhatsApp) : ${balance[1]}
                </Typography>
                <Typography variant="h5">博士通道 : ${balance[2]}</Typography>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
