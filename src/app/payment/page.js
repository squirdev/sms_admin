"use client";
import { Tab, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice";
import { getAllDeposit } from "../api/payment";
import { getSms } from "../api/sms";
import RechargePanel from "./rechargePanel";
import ConsumePanel from "./consumePanel";
import DatePicker from "../components/datePicker";

export default function PaymentLog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [paymentData, setPaymentData] = useState([]);
  const [smsData, setSMSData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const totalDeposit = useMemo(() => {
    return paymentData.reduce((sum, p) => sum + p.amount, 0);
  }, [paymentData]);

  const totalProfit = useMemo(() => {
    console.log(smsData);
    return smsData.reduce(
      (sum, p) =>
        sum +
        (p?.userId?.isTestUser ? 0 : p.totalCount * p.userPerPrice) -
        p.sendCount * p.sysPerPrice,
      0
    );
  }, [smsData]);

  const [searchDate, setSearchDate] = useState(new Date());

  const fetchPaymentDetail = async () => {
    try {
      setIsLoading(true);
      const result = await getAllDeposit(searchDate);
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
      }
      if (result.status === 200) {
        setPaymentData(result.data);
      }
    } catch (error) {
      console.log("ERROR", error);
      setPaymentData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSMSLogDetail = async () => {
    try {
      setIsLoading(true);
      const result = await getSms(searchDate);
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
      }
      if (result.status === 200) {
        setSMSData(result.data);
      }
    } catch (error) {
      console.log("ERROR", error);
      setSMSData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSMSLogDetail();
    fetchPaymentDetail();
  }, [searchDate]);

  return (
    <div className="p-10">
      <DatePicker searchDate={searchDate} setSearchDate={setSearchDate} />
      <Tabs value="deposit">
        <TabsHeader>
          <Tab key="deposit" value="deposit">
            充值
          </Tab>
          <Tab key="withdraw" value="withdraw">
            消耗
          </Tab>
        </TabsHeader>
        <TabsBody>
          <RechargePanel
            isLoading={isLoading}
            totalDeposit={totalDeposit}
            paymentData={paymentData}
          />
          <ConsumePanel
            isLoading={isLoading}
            totalProfit={totalProfit}
            smsData={smsData}
          />
        </TabsBody>
      </Tabs>
    </div>
  );
}
