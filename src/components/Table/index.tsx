import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { getBinValue } from '~/helpers/binary'

import './conditional.css'

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
  const conditional = useMemo(
    () =>
      Array.from(values)
        .map((rowValue, rowKey) => {
          const binary = getBinValue(rowKey, columns)

          return {
            binary,
            group: `( ${Array.from(binary)
              .map((groupValue, groupKey) =>
                groupValue === '1' ? keys[groupKey] : `!${keys[groupKey]}`,
              )
              .join(' && ')} )`,
            value: rowValue,
          }
        })
        .filter((it) => it.value),
    [values, columns],
  )

  const parsedConditional = useMemo(
    () => conditional.map((it) => it.group).join(' || '),
    [conditional],
  )

  const htmlParsedConditional = useMemo(
    () =>
      parsedConditional
        .replace(/\|\|/g, '<span class="conditional-or">||</span>')
        .replace(/\(/g, '<span class="conditional-parentheses">(</span>')
        .replace(/\)/g, '<span class="conditional-parentheses">)</span>')
        .replace(/&&/g, '<span class="conditional-and">&&</span>'),
    [parsedConditional],
  )

  const simplifiedUri = useMemo(
    () =>
      `https://www.wolframalpha.com/input/?i=${encodeURIComponent(
        parsedConditional,
      )}`,
    [parsedConditional],
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
    setColumns((oldColumns) => Math.min(keys.length, oldColumns + 1))
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
            <th className="border px-4 py-2 bg-gray-200">Result</th>
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
              <td className={getCellClassName('border px-4 py-2', values[row])}>
                <select
                  className="w-full p-2 bg-transparent outline-none"
                  value={values[row] ? 'TRUE' : 'FALSE'}
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

      <div
        className="text-center bg-blue-500 text-white text-lg p-4"
        role="alert"
      >
        <p
          dangerouslySetInnerHTML={{
            __html: htmlParsedConditional || `Result will always be FALSE.`,
          }}
        />
      </div>

      {parsedConditional && (
        <div className="my-5 text-center">
          <a
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            target="blank"
            href={simplifiedUri}
          >
            Simplify
          </a>
        </div>
      )}
    </div>
  )
}

export default Table
