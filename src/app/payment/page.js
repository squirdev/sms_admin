"use client";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/authSlice";
import { getAllDeposit } from "../api/payment";
import { getSms } from "../api/sms";

export default function PaymentLog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [paymentData, setPaymentData] = useState([]);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [smsData, setSMSData] = useState([]);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  useEffect(() => {
    const fetchData1 = async () => {
      const result = await getAllDeposit();
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
        return;
      }
      if (result.status === 200) {
        setPaymentData(result.data);
        let total = result.data.reduce((sum, data) => sum + data.amount, 0);
        setTotalDeposit(total);
        return;
      }
    };
    const fetchData2 = async () => {
      const result = await getSms();
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
        return;
      }
      if (result.status === 200) {
        setSMSData(result.data);
        let totalwithdraw = result.data.reduce(
          (sum, data) => sum + data.input_phone.length * data.price,
          0
        );
        setTotalWithdraw(totalwithdraw);
        let totalprofit = result.data.reduce(
          (sum, data) =>
            sum +
            Number(
              (
                data.input_phone.length * data.price -
                0.058 * data.count
              ).toFixed(2)
            ),
          0
        );
        setTotalProfit(totalprofit);
        return;
      }
    };
    fetchData2();
    fetchData1();
  }, []);
  const TABLE_HEAD_DEPOSIT = ["用户名", "用户内容", "充值金额", "时间"];
  const TABLE_HEAD_WITHDRAW = [
    "用户名",
    "用户内容",
    "花费金额",
    "利润",
    "时间",
  ];
  return (
    <div className="p-10">
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
          <TabPanel key="deposit" value="deposit">
            <p className="font-medium">总充值金额: ${totalDeposit}</p>
            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD_DEPOSIT.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-gray-100 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paymentData &&
                  paymentData.map((data, index) => {
                    const isLast = index === paymentData.length - 1;
                    const classes = isLast
                      ? "p-2"
                      : "p-2 border-b border-blue-gray-50";
                    return (
                      <tr key={index} className="hover:bg-gray-500">
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {data.userId.username}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {data.userId.content}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {data.amount}$
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {data.t_time.split("T")[0]}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {data.t_time.split("T")[1].slice(0, 5)}
                          </Typography>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel key="withdraw" value="withdraw">
            <div className="flex justify-between items-center">
              <p className="font-medium">总消费金额: ${totalWithdraw}</p>
              <p className="font-medium">总利润: ${totalProfit}</p>
            </div>

            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD_WITHDRAW.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-gray-100 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {smsData.map((data, index) => {
                  const isLast = index === smsData.length - 1;
                  const classes = isLast
                    ? "p-2"
                    : "p-2 border-b border-blue-gray-50";
                  return (
                    <tr key={index} className="hover:bg-gray-500">
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.userId.username}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.userId.content}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.input_phone.length} * {data.price} = $
                          {data.input_phone.length * data.price}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          ({data.input_phone.length} * {data.price}) - 0.058 *
                          {data.count} = $
                          {(
                            data.input_phone.length * data.price -
                            0.058 * data.count
                          ).toFixed(2)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.t_time.split("T")[0]}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {data.t_time.split("T")[1].slice(0, 5)}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
}
