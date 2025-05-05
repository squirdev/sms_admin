import Image from "next/image";

const TableNoData = ({ colSpan }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="py-6 text-center">
        <div className="flex flex-col justify-center items-center gap-2 text-md0 text-gray-600">
          <Image src={"/nodata.jpg"} width={120} height={120} alt="No Data" />
          无可用数据
        </div>
      </td>
    </tr>
  );
};

export default TableNoData;
