"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

export default function SMSLog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [smsData, setSMSData] = useState([]);
  const [open, setOpen] = useState(false);
  const [phonelist, setPhoneList] = useState([]);
  const [r_phonelist, setRPhoneList] = useState([]);
  const [s_phonelist, setSPhoneList] = useState([]);
  const handleOpen = () => setOpen(!open);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getSms();
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
        return;
      }
      if (result.status === 200) {
        setSMSData(result.data);
        return;
      }
    };
    fetchData();
  }, []);
  const TABLE_HEAD = [
    "用户名",
    "用户内容",
    "输入电话号码数量",
    "已发送电话号码数",
    "显示电话号码数量",
    "内容",
    "发件人 ID",
    "控制百分比",
    "用户显示百分比",
    "时间",
  ];
  return (
    <div className="p-10">
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
          {smsData.map((data, index) => {
            const isLast = index === smsData.length - 1;
            const classes = isLast ? "p-2" : "p-2 border-b border-blue-gray-50";
            return (
              <tr
                key={index}
                className="hover:bg-gray-500"
                onClick={() => {
                  setPhoneList(data.input_phone);
                  setSPhoneList(data.show_phone);
                  setRPhoneList(data.output_phone);
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
                    {data.input_phone.length}
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
                    {data.show_phone.length}
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
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>短信日志</DialogHeader>
        <DialogBody className="flex flex-row w-full gap-2">
          <div className="w-full gap-2 flex flex-col">
            <p>输入电话号码列表({phonelist.length})</p>
            <textarea
              value={s_phonelist.join("\n")}
              readOnly
              className="w-full h-48 overflow-auto border border-gray-500 rounded-md p-3 resize-none"
            />
          </div>
          <div className="w-full gap-2 flex flex-col">
            <p>已发送电话号码列表({r_phonelist.length})</p>
            <textarea
              value={r_phonelist.join("\n")}
              readOnly
              className="w-full h-48 overflow-auto border border-gray-500 rounded-md p-3 resize-none"
            />
          </div>
          <div className="w-full gap-2 flex flex-col">
            <p>用户显示电话号码列表({s_phonelist.length})</p>
            <textarea
              value={s_phonelist.join("\n")}
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
