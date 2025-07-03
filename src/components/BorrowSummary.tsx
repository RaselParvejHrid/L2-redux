import React from "react";
import { useBorrowSummariesQuery } from "../redux/features/api/apiSlice/apiSlice";

const BorrowSummary: React.FC = () => {
  const {
    data: summaries,
    isLoading,
    isError,
    error,
  } = useBorrowSummariesQuery();

  if (isLoading)
    return <div className="text-center p-4">Loading borrow summaries...</div>;
  if (isError)
    return (
      <div className="text-center p-4 text-red-600">
        Error:{" "}
        {(error as any)?.data?.message ?? "Failed to fetch borrow summaries"}
      </div>
    );

  return (
    <div className="p-4 max-w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Borrow Summaries
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Title
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                ISBN
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Total Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {summaries && summaries.length > 0 ? (
              summaries.map((summary) => (
                <tr
                  key={summary.book.isbn}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {summary.book.title}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {summary.book.isbn}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {summary.totalQuantity}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-4 px-4 text-center text-gray-600">
                  No borrow summaries available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowSummary;
