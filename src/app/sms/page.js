"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSms } from "../api/sms";
import { logout } from "../../../redux/authSlice";

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import TableLoading from "../components/tableLoading";
import TableNoData from "../components/tableNoData";
import { getSimplifiedDateTime } from "@/helper";
import DatePicker from "../components/datePicker";
import { BsBootstrapReboot } from "react-icons/bs";

export default function SMSLog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [smsData, setSMSData] = useState([]);
  const [searchDate, setSearchDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [open, setOpen] = useState(false);
  const [phonelist, setPhoneList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const handleOpen = () => setOpen(!open);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result = await getSms(searchDate);
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
        return;
      }
      if (result.status === 200) {
        console.log("SMS DATA:", result.data);
        setSMSData(result.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshPage = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [searchDate]);

  const TABLE_HEAD = [
    "用户名",
    "用户内容",
    "输入电话号码数量",
    "已发送电话号码数",
    "Network(网络)",
    "内容",
    "发件人 ID",
    "控制百分比",
    "时间",
  ];

  return (
    <div className="p-10">
      <div className="w-full flex justify-between">
        <DatePicker searchDate={searchDate} setSearchDate={setSearchDate} />
        <button
          onClick={handleRefreshPage}
          className="flex items-center gap-1 text-green-500 font-bold"
        >
          <BsBootstrapReboot className="w-5 h-5" />
          <p className="text-lg">重新加载</p>
        </button>
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
          {isLoading ? (
            <TableLoading colSpan={TABLE_HEAD.length} />
          ) : smsData && smsData.length != 0 ? (
            smsData.map((data, index) => {
              const isLast = index === smsData.length - 1;
              const classes = isLast
                ? "p-2"
                : "p-2 border-b border-blue-gray-50";
              return (
                <tr
                  key={index}
                  className="hover:bg-gray-500"
                  onClick={() => {
                    setPhoneList(data.input_phone);
                    handleOpen();
                  }}
                >
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
                      {data.totalCount}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {data.sendCount}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {data.network}
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
                      {getSimplifiedDateTime(data.t_time)}
                    </Typography>
                  </td>
                </tr>
              );
            })
          ) : (
            <TableNoData colSpan={TABLE_HEAD.length} />
          )}
        </tbody>
      </table>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>短信日志</DialogHeader>
        <DialogBody className="flex flex-row w-full gap-2">
          <div className="w-full gap-2 flex flex-col">
            <p>用户显示电话号码列表({phonelist.length})</p>
            <textarea
              value={phonelist.join("\n")}
              readOnly
              className="w-full h-48 overflow-auto border border-gray-500 rounded-md p-3 resize-none"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button color="red" onClick={handleOpen} className="mr-1">
            <span>取消</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
