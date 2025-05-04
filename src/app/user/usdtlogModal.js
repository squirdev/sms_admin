import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import CustomAlert from "../components/customAlert";
import { getUSDTLog } from "../api/user";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice";

export default function USDTLog({ usdtLogOpen, handleUSDTLogOpen, data }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [paymentData, setPaymentData] = useState([]);
  const [totolAmount, setTotalAmount] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };
  useEffect(() => {
    const fetchData = async () => {
      const result = await getUSDTLog(data._id);
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
        return;
      }
      if (result.status === 200) {
        setPaymentData(result.data);
        let total = result.data.reduce((sum, data) => sum + data.amount, 0);
        setTotalAmount(total);
        return;
      }
    };
    fetchData();
  }, [usdtLogOpen]);
  const TABLE_HEAD = ["充值金额", "时间"];
  return (
    <div>
      <Dialog open={usdtLogOpen} handler={handleUSDTLogOpen}>
        <DialogHeader>付款日志</DialogHeader>
        <DialogBody className="flex flex-col gap-4 overflow-y-auto h-96">
          <CustomAlert message={alertMessage} />
          <p className="font-medium">总充值金额: ${totolAmount}</p>
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
        </DialogBody>
        <DialogFooter>
          <Button color="red" onClick={handleUSDTLogOpen} className="mr-1">
            <span>取消</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
