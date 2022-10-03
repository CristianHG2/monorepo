import React from 'react';
import {classNames} from '../../support/utils';
import Cell from './Cell';

type TableProps<T> = {
  data: T[];
  columns: {name: string; className?: string}[];
  children: (
    row: T,
    components: {
      Cell: typeof Cell;
    },
  ) => React.ReactNode;
};

const Table = <T,>({data, columns, children}: TableProps<T>) => {
  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map(column => (
                    <th
                      key={column.name}
                      scope="col"
                      className={classNames(
                        column.className ?? '',
                        'py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6',
                      )}
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.map((row, index) => (
                  <tr key={index}>{children(row, {Cell})}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
