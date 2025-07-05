'use client'
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useCallback, useEffect, useRef, useState } from "react";
import { IntegerInput } from "./IntegerInput";
import { usePapaParse } from "react-papaparse";
import { basePath, LinkId, QuestNames, quests } from "@/utils/constants";
import { ParseResult } from "papaparse";

type DataRow = {
  ppid: number;
}

type Values = {
  points?: number;
  rolls?: number;
  diceFromBoard?: number;
  startDice?: number;
  endDice?: number;
}

type Result = {
  error?: string;
  numDice?: number;
  ppid?: number;
  percentile?: string;
}

export default function PpidCalculatorContent() {
  const { readRemoteFile } = usePapaParse();
  const data = useRef<DataRow[]>([]);
  const [knowDiceFromBoard, setKnowDiceFromBoard] = useState<boolean | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const values = useRef<Values>({});

  const handleKnowDiceFromBoard = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newValue: boolean | null) => {
      setKnowDiceFromBoard(newValue);
    },
    []
  );

  const onPointsChange = useCallback(
    (newValue: number) => {
      values.current.points = newValue;
    },
    []
  );
  
  const onRollsChange = useCallback(
    (newValue: number) => {
      values.current.rolls = newValue;
    },
    []
  );
  
  const onDiceFromBoardChange = useCallback(
    (newValue: number) => {
      values.current.diceFromBoard = newValue;
    },
    []
  );

  const onStartDiceChange = useCallback(
    (newValue: number) => {
      values.current.startDice = newValue;
    },
    []
  );
  
  const onEndDiceChange = useCallback(
    (newValue: number) => {
      values.current.endDice = newValue;
    },
    []
  );

  const onCalculate = () => {
    const result: Result = {}
    if (values.current.points === undefined) {
      result.error = "Points field missing.";
    }
    else if (values.current.rolls === undefined) {
      result.error = "Rolls field missing.";
    }
    else if (knowDiceFromBoard === null) {
      result.error = "Extra dice from the board is untoggled.";
    }
    else if (knowDiceFromBoard === true) {
      if (values.current.diceFromBoard === undefined) {
        result.error = "Extra dice from the board field missing.";
      }
      else {
        let diceFromQuests = 0;
        // going to use key quests since that's the one that matters
        const gettingPointsQuest = quests.find(q => q.name === QuestNames.GettingPoints);
        const rollDiceQuest = quests.find(q => q.name === QuestNames.RollDice);
        if (gettingPointsQuest) {
          for (let i = 0; i < gettingPointsQuest.breakpoints[0].length; i++) {
            const bp = gettingPointsQuest.breakpoints[0][i];
            if (values.current.points >= bp) {
              diceFromQuests += gettingPointsQuest.breakpoints[1][i];
            }
          }
        }
        if (rollDiceQuest) {
          for (let i = 0; i < rollDiceQuest.breakpoints[0].length; i++) {
            const bp = rollDiceQuest.breakpoints[0][i];
            if (values.current.rolls >= bp) {
              diceFromQuests += rollDiceQuest.breakpoints[1][i];
            }
          }
        }
        result.numDice = values.current.rolls - values.current.diceFromBoard - diceFromQuests;
      }
    }
    else if (knowDiceFromBoard === false) {
      if (values.current.startDice === undefined) {
        result.error = "Start dice field missing.";
      }
      else if (values.current.endDice === undefined) {
        result.error = "End dice field missing.";
      }
      else {
        result.numDice = values.current.startDice - values.current.endDice;
      }
    }

    if (typeof(result.numDice) === "number") {
      result.ppid = result.numDice <= 0 ? Infinity : Math.round(values.current.points! / result.numDice * 100) / 100;
    }

    if (result.ppid) {
      const totalDataPoints = data.current.length;
      let foundIndex = data.current.findLastIndex(value => value.ppid <= result.ppid!);
      // set PPID to always be over 0
      if (foundIndex <= 0) {
        foundIndex = 1;
      }
      result.percentile = `${(foundIndex/totalDataPoints*100).toFixed(2)}%`;
    }
    setResult(result);
  }

  useEffect(() => {
    readRemoteFile(`${basePath}/ppid_data.csv`, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results: ParseResult<DataRow>) => {
        if (results.errors.length === 0) {
          data.current = results.data;
        }
      },
    });
  }, [readRemoteFile])

  return (
    <div className="flex flex-col gap-4">
      <p>Use this to calculate your <a href={`#${LinkId.ppid}`} className="text-blue-600 dark:text-blue-400 hover:underline">PPID</a> to see how your run compares to others.</p>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <p>How many points did you get this run?</p>
          <div className="group inline-block">
            <button className="bg-gray-400 dark:bg-gray-500 px-2 rounded-xl hover:bg-teal-600 transition duration-300 ease-in-out transform hover:scale-105">?</button>
            <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute max-w-48 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-lg z-10">
              <p className="px-2 py-1">{`You can find this in Otta's Treasure at the top of the screen.`}</p>
            </div>
          </div>
        </div>
        <div className="w-[120px]">
          <IntegerInput name="pointInput" onValueChange={onPointsChange} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <p>How many rolls did you do in total?</p>
          <div className="group inline-block">
            <button className="bg-gray-400 dark:bg-gray-500 px-2 rounded-xl hover:bg-teal-600 transition duration-300 ease-in-out transform hover:scale-105">?</button>
            <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute max-w-48 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-lg z-10">
              <p className="px-2 py-1">{`You can find this in 'Roll Dice' task.`}</p>
            </div>
          </div>
        </div>
        <div className="w-[120px]">
          <IntegerInput name="rollInput" onValueChange={onRollsChange} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p>Did you keep track of the number of extra dice you got from the board?</p>
        <ToggleButtonGroup
          size="small"
          value={knowDiceFromBoard}
          exclusive
          onChange={handleKnowDiceFromBoard}
          aria-label="know dice from board"
        >
          <ToggleButton value={true} aria-label="Yes">Yes</ToggleButton>
          <ToggleButton value={false} aria-label="No">No</ToggleButton>
        </ToggleButtonGroup>
      </div>
      {knowDiceFromBoard === true && <div className="flex flex-col gap-1">
        <p>How many extra dice did you get from the board?</p>
        <div className="w-[120px]">
          <IntegerInput name="diceFromBoardInput" onValueChange={onDiceFromBoardChange} />
        </div>
      </div>}
      {knowDiceFromBoard === false && <>
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <p>{`How many dice did you start rolling with? This is the number BEFORE you did any rolling BUT after you have collected all other tasks and rewards.`}</p>
          </div>
          <div className="w-[120px]">
            <IntegerInput name="startDiceInput" onValueChange={onStartDiceChange} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <p>{`How many dice do you have left after rolling? This is the number AFTER you finished rolling AND collected all rolling tasks and rewards.`}</p>
          </div>
          <div className="w-[120px]">
            <IntegerInput name="endDiceInput" onValueChange={onEndDiceChange} />
          </div>
        </div>
      </>}
      <div className="w-3xs">
        <Button variant="contained" onClick={onCalculate}>Calculate</Button>
      </div>
      {result && <div className="flex flex-col gap-1">
        {result.error && <div>
          {result.error}
        </div>}
        {values.current.points && <div>
          Number of points: {values.current.points}
        </div>}
        {typeof(result.numDice) === "number" && <div>
          Number of Dice Used: {result.numDice}
        </div>}
        {result.ppid && <div>
          Points per Initial Dice: {result.ppid}
        </div>}
        {result.percentile && <div className="flex gap-1">
          <p>Percentile: {result.percentile}</p>
          <div className="group inline-block">
            <button className="bg-gray-400 dark:bg-gray-500 px-2 rounded-xl hover:bg-teal-600 transition duration-300 ease-in-out transform hover:scale-105">?</button>
            <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute max-w-48 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-lg z-10">
              <p className="px-2 py-1">{`This percentile lets you know how your run compared to others. The higher the percentile, the luckier you were.`}</p>
            </div>
          </div>
        </div>}
      </div>}
    </div>
  )
}