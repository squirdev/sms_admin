const TableLoading = ({ colSpan }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="py-6 text-center">
        <div className="flex justify-center items-center gap-2 text-md0 text-gray-600">
          <span className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full" />
          加载中
        </div>
      </td>
    </tr>
  );
};

export default TableLoading;
