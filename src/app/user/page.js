"use client";

import { useEffect, useState } from "react";
import { getUserList } from "../api/user";
import {
  Button,
  IconButton,
  Input,
  Option,
  Select,
  Switch,
  Typography,
} from "@material-tailwind/react";
import { MdModeEditOutline } from "react-icons/md";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import CreateUser from "./createModal";
import { logout } from "../../../redux/authSlice";
import UpdateActiveUser from "./updateActiveModal";
import UpdateUser from "./updateModal";
import CustomAlert from "../components/customAlert";
import DepositUser from "./depositModal";
import { LiaSmsSolid } from "react-icons/lia";
import { TbClockDollar } from "react-icons/tb";
import USDTLog from "./usdtlogModal";
import SMSLog from "./smslogModal";
export default function UserPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateActiveOpen, setUpdateActiveOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [usdtLogOpen, setUSDTLogOpen] = useState(false);
  const [smsLogOpen, setSMSLogOpen] = useState(false);
  const [userdata, setUserdata] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };
  const router = useRouter();
  const dispatch = useDispatch();
  const fetchData = async () => {
    const searchResult = await getUserList(page, limit, search);
    if (searchResult.status === 401) {
      dispatch(logout());
      router.push("/login");
      return;
    }
    if (searchResult.status === 200) {
      setTotal(searchResult.data.total);
      setPage(searchResult.data.page);
      setLimit(searchResult.data.limit);
      setTotalPage(searchResult.data.totalPages);
      setUserdata(searchResult.data.data);
      return;
    }
  };
  useEffect(() => {
    fetchData();
  }, [page, limit, search]);
  const handleAddOpen = () => {
    setAddOpen(!addOpen);
  };
  const handleUpdateOpen = () => {
    setUpdateOpen(!updateOpen);
  };
  const handleUpdateActiveOpen = () => {
    setUpdateActiveOpen(!updateActiveOpen);
  };
  const handleDepositOpen = () => {
    setDepositOpen(!depositOpen);
  };
  const handleUSDTLogOpen = () => {
    setUSDTLogOpen(!usdtLogOpen);
  };
  const handleSMSLogOpen = () => {
    setSMSLogOpen(!smsLogOpen);
  };
  const handleActiveSwitch = (data) => {
    handleUpdateActiveOpen();
    setSelectedData(data);
  };
  const handleUpdateUser = (data) => {
    handleUpdateOpen();
    setSelectedData(data);
  };
  const handleDepositUser = (data) => {
    handleDepositOpen();
    setSelectedData(data);
  };
  const handleUSDTLog = (data) => {
    handleUSDTLogOpen();
    setSelectedData(data);
  };
  const handleSMSlog = (data) => {
    handleSMSLogOpen();
    setSelectedData(data);
  };
  const TABLE_HEAD = [
    "用户名",
    "密码",
    "标注",
    "USDT",
    "短信价格",
    "短信成功率",
    "活跃状态",
    "行动",
    "日志",
  ];
  return (
    <div className="content w-full">
      <div className="flex flex-col gap-4 w-full bg-gray-300 p-10">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center whitespace-nowrap">
            <Input label="搜索" onChange={(e) => setSearch(e.target.value)} />
            <Button color="blue" onClick={handleAddOpen}>
              创建用户
            </Button>
          </div>
          <div className="flex flex-row items-center gap-4">
            <p>总用户数: {total}</p>
            <div>
              <Select
                value={limit}
                onChange={(val) => setLimit(val)}
                label="每页计数"
              >
                <Option value={10}>10</Option>
                <Option value={20}>20</Option>
                <Option value={30}>30</Option>
                <Option value={50}>50</Option>
                <Option value={100}>100</Option>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <IconButton
                size="sm"
                variant="outlined"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
              >
                <FaArrowLeft strokeWidth={2} className="h-4 w-4" />
              </IconButton>
              <Typography color="gray" className="font-normal flex flex-row">
                {page}页,&nbsp;共 {totalPage}页
              </Typography>
              <IconButton
                size="sm"
                variant="outlined"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === totalPage}
              >
                <FaArrowRight strokeWidth={2} className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-end"></div>
        <div className="w-full min-w-max text-left">
          <table className="w-full table-auto">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
              {userdata.map((data, index) => {
                const isLast = index === userdata.length - 1;
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
                        {data.username}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {data.password}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
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
                        ${data.usdt?.toFixed(2)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        ${data.price}
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
                      <Switch
                        color="green"
                        checked={data.status}
                        onChange={() => handleActiveSwitch(data)}
                      />
                    </td>
                    <td className={classes}>
                      <div className="flex flex-row gap-1  items-center">
                        <IconButton
                          color="green"
                          onClick={() => handleDepositUser(data)}
                        >
                          <FaDollarSign size={20} />
                        </IconButton>
                        <IconButton
                          color="green"
                          onClick={() => handleUpdateUser(data)}
                        >
                          <MdModeEditOutline size={20} />
                        </IconButton>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-row gap-1  items-center">
                        <IconButton
                          color="white"
                          onClick={() => handleSMSlog(data)}
                        >
                          <LiaSmsSolid size={20} />
                        </IconButton>
                        <IconButton
                          color="white"
                          onClick={() => handleUSDTLog(data)}
                        >
                          <TbClockDollar size={20} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <CreateUser
        addOpen={addOpen}
        handleAddOpen={() => handleAddOpen()}
        fetchData={() => fetchData()}
      />
      <UpdateActiveUser
        updateActiveOpen={updateActiveOpen}
        handleUpdateActiveOpen={() => handleUpdateActiveOpen()}
        fetchData={() => fetchData()}
        data={selectedData}
      />
      <UpdateUser
        updateOpen={updateOpen}
        handleUpdateOpen={() => handleUpdateOpen()}
        fetchData={() => fetchData()}
        data={selectedData}
      />
      <DepositUser
        depositOpen={depositOpen}
        handleDepositOpen={() => handleDepositOpen()}
        fetchData={() => fetchData()}
        data={selectedData}
      />
      <USDTLog
        usdtLogOpen={usdtLogOpen}
        handleUSDTLogOpen={() => handleUSDTLogOpen()}
        data={selectedData}
      />
      <SMSLog
        smsLogOpen={smsLogOpen}
        handleSMSLogOpen={() => handleSMSLogOpen()}
        data={selectedData}
      />
      <CustomAlert message={alertMessage} />
    </div>
  );
}
