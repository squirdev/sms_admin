import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getSMSLog } from "../api/user";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice";

export default function SMSLog({ smsLogOpen, handleSMSLogOpen, data }) {
  console.log("DATA", data);
  const router = useRouter();
  const dispatch = useDispatch();
  const [smsData, setSMSData] = useState([]);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  const fetchData = async () => {
    if (!data || !data._id) return;
    const result = await getSMSLog(data._id);
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
            (data.input_phone.length * data.price - 0.058 * data.count).toFixed(
              2
            )
          ),
        0
      );
      setTotalProfit(totalprofit);
    }
  };

  useEffect(() => {
    fetchData();
  }, [data, smsLogOpen]);

  const TABLE_HEAD = [
    "输入电话号码数",
    "已发送电话号码数",
    "显示电话号码数量",
    "内容",
    "发件人 ID",
    "控制百分比",
    "花费金额",
    "利润",
    "msgId",
    "count",
    "时间",
  ];
  return (
    <Dialog open={smsLogOpen} handler={handleSMSLogOpen} size={"xl"}>
      <DialogHeader>短信日志</DialogHeader>
      <DialogBody className="flex flex-col gap-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <p className="font-medium">总消费金额: ${totalWithdraw}</p>
          <p className="font-medium">总利润: ${totalProfit}</p>
        </div>

        <table className="w-full table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
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
            {smsData &&
              smsData.map((data, index) => {
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
                        {data.input_phone.length}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal break-all whitespace-normal"
                      >
                        {data.content}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {data.sender}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {data.percent}%
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {data.show_percent}%
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
                        {data.msgId}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {data.count}
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
      </DialogBody>
      <DialogFooter>
        <Button color="red" onClick={handleSMSLogOpen} className="mr-1">
          <span>取消</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
