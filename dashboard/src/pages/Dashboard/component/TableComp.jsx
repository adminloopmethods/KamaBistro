import React from 'react';

const TableComp = ({ columns = [], data = [], title, action, actions }) => {
  return (
    <div className="overflow-x-auto w-full border rounded-3xl mt-6 p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-stone-900">
      <h2 className="text-[24px] font-[600] mb-3 text-black dark:text-white">
        {title || 'Title'} ({data.length})
      </h2>

      <table className="min-w-full">
        <thead className="bg-white dark:bg-stone-800">
          <tr>
            {
              columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  {col.header}
                </th>
              ))
            }
            {
              action &&
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Action
              </th>
            }
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-stone-900 divide-y dark:divide-gray-700">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-4 text-gray-500 dark:text-gray-400"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-stone-800"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                  >
                    {typeof col.render === 'function'
                      ? col.render(row[col.key], row)
                      : row[col.key]}
                  </td>
                ))}
                {
                  action &&
                  <td className="px-4 py-2">
                    {actions ? actions(row) : null}
                  </td>
                }

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComp;
