import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import { getUSDTLog } from "../api/user";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice";
import { getSimplifiedDateTime } from "@/helper";
import TableLoading from "../components/tableLoading";
import TableNoData from "../components/tableNoData";

export default function USDTLog({ usdtLogOpen, handleUSDTLogOpen, data }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [paymentData, setPaymentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const totalAmount = useMemo(() => {
    return paymentData.reduce((sum, data) => sum + data.amount, 0);
  }, [paymentData, usdtLogOpen]);

  const fetchData = async () => {
    try {
      if (!data._id) return;
      setIsLoading(true);
      const result = await getUSDTLog(data._id);
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
      } else if (result.status === 200) {
        setPaymentData(result.data);
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [data, usdtLogOpen]);

  const TABLE_HEAD = ["No", "充值金额", "时间"];
  return (
    <div>
      <Dialog open={usdtLogOpen} handler={handleUSDTLogOpen}>
        <DialogHeader>付款日志</DialogHeader>
        <DialogBody className="flex flex-col gap-4 overflow-y-auto h-96">
          <div className="flex font-medium">
            <p>总充值金额: $</p>
            <p>{totalAmount}</p>
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
              ) : paymentData && paymentData.length != 0 ? (
                paymentData.map((data, index) => {
                  return (
                    <tr key={index} className="hover:bg-gray-200">
                      {[
                        index + 1,
                        data.amount + " $",
                        getSimplifiedDateTime(data.t_time),
                      ].map((item, index) => (
                        <td
                          key={index}
                          className="p-2 px-4 border-b border-blue-gray-50"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {item}
                          </Typography>
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <TableNoData colSpan={TABLE_HEAD.length} />
              )}
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter>
          <Button color="red" onClick={handleUSDTLogOpen} className="mr-1">
            <span>确认</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
