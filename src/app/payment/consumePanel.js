import { getSimplifiedDateTime } from "@/helper";
import { TabPanel, Typography } from "@material-tailwind/react";
import TableLoading from "../components/tableLoading";
import TableNoData from "../components/tableNoData";

const TABLE_HEAD_WITHDRAW = [
  "No",
  "用户名",
  "用户内容",
  "客户付款金额",
  "用户短信价格",
  "服务已发送的金额",
  "短信发送费用",
  "利润",
  "时间",
];

const ConsumePanel = ({ isLoading, totalProfit, smsData }) => {
  return (
    <TabPanel key="withdraw" value="withdraw">
      <div className="flex justify-end items-center">
        <div className="font-medium flex gap-1">
          <p>总利润: $ </p>
          <p>{totalProfit.toFixed(3)}</p>
        </div>
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
          {isLoading ? (
            <TableLoading colSpan={TABLE_HEAD_WITHDRAW.length} />
          ) : smsData && smsData.length != 0 ? (
            smsData.map((data, index) => {
              let benefit =
                (data?.userId?.isTestUser
                  ? 0
                  : data.totalCount * data.userPerPrice) -
                data.sendCount * data.sysPerPrice;
              return (
                <tr key={index} className="hover:bg-gray-500">
                  {[
                    index + 1,
                    data.userId.username,
                    data.userId.content,
                    data.totalCount,
                    data.userPerPrice,
                    data.sendCount,
                    data.sysPerPrice,
                    "$ " + benefit.toFixed(3),
                    getSimplifiedDateTime(data.t_time),
                  ].map((item, idx) => (
                    <td key={idx} className="p-2 border-b border-blue-gray-100">
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
            <TableNoData colSpan={TABLE_HEAD_WITHDRAW.length} />
          )}
        </tbody>
      </table>
    </TabPanel>
  );
};

export default ConsumePanel;
