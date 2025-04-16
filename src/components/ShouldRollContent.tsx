"use client"
import { ParseResult } from 'papaparse';
import { usePapaParse } from 'react-papaparse';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { basePath } from '@/utils/constants';

const intervals = [5,10,20,25, 50, 100];
type IntervalSelectProps = {
  name: string;
  initialValue: number;
  onValueChange?: (value: number) => void;
}
const IntervalSelect = (props: IntervalSelectProps) => {
  const { name, initialValue, onValueChange } = props;
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const newValue = parseInt(event.target.value);
      setValue(newValue);
      if (onValueChange) { 
        onValueChange(newValue);
      }
    },
    [onValueChange]
  );

  return <select
    name={name}
    className="text-sm text-center border border-gray-800 dark:border-gray-200 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-inset focus:ring-blue-600 bg-transparent"
    value={value}
    onChange={handleChange}
  >
    {intervals.map((interval, index) => (
      <option key={index} value={interval} className="bg-gray-200 dark:bg-gray-800">{interval}</option>
    ))}
  </select>
}

type DataRow = {
  startingDice: number;
  twenty: string;
  forty: string;
  sixty: string;
  eighty: string;
  hundred: string;
}

export default function ShouldRollContent() {
  const { readRemoteFile } = usePapaParse();
  const data = useRef<DataRow[]>([]);
  const [rows, setRows] = useState<DataRow[]>([]);

  const handleIntervalChange = useCallback(
    (newValue: number) => {
      setRows(data.current.filter(row => row.startingDice % newValue === 0));
    },
    []
  )

  useEffect(() => {
    readRemoteFile(`${basePath}/data.csv`, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results: ParseResult<DataRow>) => {
        if (results.errors.length === 0) {
          data.current = results.data;
          handleIntervalChange(intervals[3]);
        }
      },
    });
  }, [readRemoteFile, handleIntervalChange])
  
  return (
    <div>
      <p className="pb-2">
        Decide for yourself when you should start rolling based on your own risk tolerance. <br />
        You can save dice between events to have a better chance of hitting your points goal. <br />
        The table below shows you the chance of reaching that points goal based on how many dice you started with. <br />
        <strong className="pb-2 underline">Tip</strong>: 
        During key rotation, you should at least roll until you get 50+ points. This will assign you the lowest rank of 1001+ which still gives one free Chroma Key.
      </p>
      <p className="text-sm max-w-xl mx-auto">{`'Starting Dice' is the amount of dice you have BEFORE you do any rolling. Go to the 'Where are the dice?!' section to see which quests impact this.`}</p>
      <table className="w-full max-w-xl border-collapse border border-gray-700 mx-auto">
        <thead>
          <tr className="bg-gray-400 dark:bg-gray-700">
            <th className="pt-1 px-1 text-center">Starting Dice</th>
            <th className="pt-1 px-1 text-center" colSpan={5}>% Chance of Reaching Points</th>
          </tr>
          <tr className="bg-gray-400 dark:bg-gray-700">
            <th className="px-1">
              <IntervalSelect name="intervalSelect" initialValue={intervals[3]} onValueChange={handleIntervalChange} />
            </th >
            <th className="px-1 text-center">20k</th>
            <th className="px-1 text-center">40k</th>
            <th className="px-1 text-center">60k</th>
            <th className="px-1 text-center">80k</th>
            <th className="px-1 text-center">100k</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="px-1 text-center">{row.startingDice}</td>
              <td className="px-1 text-center">{row.twenty}</td>
              <td className="px-1 text-center">{row.forty}</td>
              <td className="px-1 text-center">{row.sixty}</td>
              <td className="px-1 text-center">{row.eighty}</td>
              <td className="px-1 text-center">{row.hundred}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}