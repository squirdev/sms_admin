import { getSimplifiedDateTime } from "@/helper";
import TableLoading from "../components/tableLoading";
import TableNoData from "../components/tableNoData";

const { TabPanel, Typography } = require("@material-tailwind/react");

const TABLE_HEAD_DEPOSIT = ["用户名", "用户内容", "充值金额", "时间"];

const RechargePanel = ({ isLoading, totalDeposit, paymentData }) => {
  return (
    <TabPanel key="deposit" value="deposit">
      <div className="font-medium">
        <span>总充值金额: $</span>
        <span>{totalDeposit}</span>
      </div>
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
          {isLoading ? (
            <TableLoading colSpan={TABLE_HEAD_DEPOSIT.length} />
          ) : paymentData && paymentData.length != 0 ? (
            paymentData.map((data, index) => {
              return (
                <tr key={index} className="hover:bg-gray-500">
                  {[
                    data.userId.username,
                    data.userId.content,
                    "$ " + data.amount,
                    getSimplifiedDateTime(data.t_time),
                  ].map((item, index) => (
                    <td
                      key={index}
                      className="p-2 border-b border-blue-gray-100"
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
            <TableNoData colSpan={TABLE_HEAD_DEPOSIT.length} />
          )}
        </tbody>
      </table>
    </TabPanel>
  );
};

export default RechargePanel;
