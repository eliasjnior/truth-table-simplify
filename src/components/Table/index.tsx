import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { getBinValue } from '~/helpers/binary'

const Table: React.FC = () => {
  const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  const [values, setValues] = useState<Array<boolean>>([])
  const [columns, setColumns] = useState<number>(3)

  const columnsArr = useMemo(
    () => Array.from(Array(columns)).map((value, key) => key),
    [columns],
  )
  const rows = useMemo(() => Math.pow(2, columns), [columns])
  const rowsArr = useMemo(
    () => Array.from(Array(rows)).map((value, key) => key),
    [rows],
  )

  const getCellClassName = useCallback(
    (commonClassName, value) =>
      `${commonClassName} ${value ? 'bg-green-400' : 'bg-red-600 text-white'}`,
    [],
  )

  const updateValue = useCallback((bit: number, value: boolean) => {
    console.log('updateValue', bit, value)
    setValues((oldValue) => {
      const newArr = Array.from(oldValue)
      newArr[bit] = value

      return newArr
    })
  }, [])

  const removeColumn = useCallback(() => {
    setColumns((oldColumns) => Math.max(2, oldColumns - 1))
  }, [])

  const addColumn = useCallback(() => {
    setColumns((oldColumns) => oldColumns + 1)
  }, [])

  useEffect(() => {
    setValues((oldValue) =>
      Array.from(Array(rows)).map((value, key) => oldValue[key] || false),
    )
  }, [rows])

  return (
    <div className="container mx-auto my-8">
      <table className="table-auto w-full">
        <thead>
          <tr>
            {columnsArr.map((column) => (
              <th className="border px-4 py-2" key={column}>
                {keys[column]}
              </th>
            ))}
            <th className="border px-4 py-2">Result</th>
          </tr>
        </thead>
        <tbody>
          {rowsArr.map((row) => (
            <tr key={row}>
              {columnsArr.map((column) => (
                <td
                  key={column}
                  className={getCellClassName(
                    'border px-4 py-2',
                    getBinValue(row, columns)[column] === '1',
                  )}
                >
                  {getBinValue(row, columns)[column] === '1' ? 'TRUE' : 'FALSE'}
                </td>
              ))}
              <td className="border px-4 py-2">
                <select
                  onChange={(e) => updateValue(row, e.target.value === 'TRUE')}
                >
                  <option value="FALSE">FALSE</option>
                  <option value="TRUE">TRUE</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="my-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={removeColumn}
      >
        Remove column
      </button>

      <button
        className="my-4 ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={addColumn}
      >
        Add column
      </button>
    </div>
  )
}

export default Table
