"use client";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice";
import { getAllDeposit } from "../api/payment";
import { getBalance, getSms } from "../api/sms";
import { getUserAll, getUserList } from "../api/user";

export default function Dashboard() {
  let startdate = new Date();

  let day = startdate.getDay();
  let diff = (day === 0 ? -6 : 1) - day;

  startdate.setDate(startdate.getDate() + diff);
  startdate.setHours(0, 0, 0, 0);
  let enddate = new Date();
  const [startDate, setStartDate] = useState(startdate);
  const [endDate, setEndDate] = useState(enddate);
  const router = useRouter();
  const dispatch = useDispatch();
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [balance, setBalance] = useState(0);
  const [remain, setRemain] = useState(0);
  useEffect(() => {
    const fetchData1 = async () => {
      const result = await getAllDeposit(startDate, endDate);
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
    const fetchData2 = async () => {
      const result = await getSms(startDate, endDate);
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
        return;
      }
      if (result.status === 200) {
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
    const fetchData3 = async () => {
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
    const fetchData4 = async () => {
      const searchResult = await getUserAll();
      if (searchResult.status === 401) {
        dispatch(logout());
        router.push("/login");
        return;
      }
      if (searchResult.status === 200) {
        let totalremain = searchResult.data.reduce(
          (sum, data) => sum + Number(data.usdt.toFixed(2)),
          0
        );
        setRemain(totalremain);
        return;
      }
    };
    fetchData2();
    fetchData1();
    fetchData3();
    fetchData4();
  }, [startDate, endDate]);
  return (
    <div className="p-10 flex flex-col justify-between items-center w-full h-full">
      <div className="border-white bg-gray-200 border-2 rounded-md p-5 mb-5 w-full">
        <div className="flex flex-row justify-center items-center gap-10">
          <Popover placement="bottom">
            <PopoverHandler>
              <Input
                label="选择开始日期"
                onChange={() => null}
                value={startDate ? format(startDate, "PPP") : ""}
              />
            </PopoverHandler>
            <PopoverContent>
              <DayPicker
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                showOutsideDays
                className="border-0"
                classNames={{
                  caption:
                    "flex justify-center py-2 mb-4 relative items-center",
                  caption_label: "text-sm font-medium text-gray-900",
                  nav: "flex items-center",
                  nav_button:
                    "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                  nav_button_previous: "absolute left-1.5",
                  nav_button_next: "absolute right-1.5",
                  table: "w-full border-collapse",
                  head_row: "flex font-medium text-gray-900",
                  head_cell: "m-0.5 w-9 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal",
                  day_range_end: "day-range-end",
                  day_selected:
                    "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                  day_today: "rounded-md bg-gray-200 text-gray-900",
                  day_outside:
                    "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                  day_disabled: "text-gray-500 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => (
                    <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                  IconRight: ({ ...props }) => (
                    <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                }}
              />
            </PopoverContent>
          </Popover>
          <Popover placement="bottom">
            <PopoverHandler>
              <Input
                label="选择结束日期"
                onChange={() => null}
                value={endDate ? format(endDate, "PPP") : ""}
              />
            </PopoverHandler>
            <PopoverContent>
              <DayPicker
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                showOutsideDays
                className="border-0"
                classNames={{
                  caption:
                    "flex justify-center py-2 mb-4 relative items-center",
                  caption_label: "text-sm font-medium text-gray-900",
                  nav: "flex items-center",
                  nav_button:
                    "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                  nav_button_previous: "absolute left-1.5",
                  nav_button_next: "absolute right-1.5",
                  table: "w-full border-collapse",
                  head_row: "flex font-medium text-gray-900",
                  head_cell: "m-0.5 w-9 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal",
                  day_range_end: "day-range-end",
                  day_selected:
                    "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                  day_today: "rounded-md bg-gray-200 text-gray-900",
                  day_outside:
                    "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                  day_disabled: "text-gray-500 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => (
                    <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                  IconRight: ({ ...props }) => (
                    <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="p-5 flex flex-row justify-center items-center h-full gap-5">
          <Card className="p-10 w-1/3 h-[300px]">
            <CardHeader
              variant="gradient"
              color="green"
              className="text-center p-3 w-full"
            >
              <Typography variant="h3" color="white">
                总充值金额
              </Typography>
            </CardHeader>
            <CardBody className="text-5xl h-full justify-center items-center flex">
              ${totalDeposit}
            </CardBody>
          </Card>
          <Card className="p-10 w-1/3 h-[300px]">
            <CardHeader
              variant="gradient"
              color="blue"
              className="justify-center items-center text-center p-3"
            >
              <Typography variant="h3" color="white">
                总消费金额
              </Typography>
            </CardHeader>
            <CardBody className="text-5xl h-full justify-center items-center flex">
              ${totalWithdraw?.toFixed(2)}
            </CardBody>
          </Card>
          <Card className="p-10 w-1/3 h-[300px]">
            <CardHeader
              variant="gradient"
              color="orange"
              className="justify-center items-center text-center p-3"
            >
              <Typography variant="h3" color="white">
                当期利润总额
              </Typography>
            </CardHeader>
            <CardBody className="text-5xl h-full justify-center items-center flex">
              ${totalProfit?.toFixed(2)}
            </CardBody>
          </Card>
        </div>
      </div>

      <Card className="p-10 h-[300px]">
        <CardHeader
          variant="gradient"
          color="purple"
          className="justify-center items-center text-center p-3"
        >
          <Typography variant="h3" color="white">
            当前剩余金额/API账户余额
          </Typography>
        </CardHeader>
        <CardBody className="text-5xl h-full justify-center items-center flex-col gap-2">
          <div
            className={`h-full justify-center items-center flex ${
              remain > balance ? "bg-red-500 rounded-md" : ""
            }`}
          >
            ${remain} / ${balance}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
