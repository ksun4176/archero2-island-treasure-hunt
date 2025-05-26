'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import { IntegerInput } from "./IntegerInput";
import { quests, Rotations } from "@/utils/constants";
import { Quest } from "@/utils/types";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";


type ProgressBarProps = {
  percentDone: number;
}
const ProgressBar = (props: ProgressBarProps) => {
  const { percentDone } = props;

  return (
    <div className="w-full max-w-40 h-[24px] bg-gray-300 dark:bg-gray-400 rounded-sm overflow-hidden" role="progressbar" aria-valuenow={percentDone} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-sm overflow-hidden bg-blue-400 dark:bg-blue-500 transition duration-500"  style={{ width: `${percentDone}%` }} />
    </div>
  )
}

type RowProps = {
  quest: Quest;
  onNumDiceChange?: (key: string, diceEarned: number, diceLeft: number) => void;
}
const Row = (props: RowProps) => {
  const { quest, onNumDiceChange } = props;
  const [numBreakpointsMet, setNumBreakpointsMet] = useState(0);
  const numDiceLeft = useRef(0);

  const numBreakpoints = quest.breakpoints[0].length;

  const handleProgressChange = useCallback(
    (newValue: number) => {
      let numBreakpointsMet = quest.breakpoints[0].findIndex(bp => bp > newValue);
      if (numBreakpointsMet === -1) { //all completed
        numBreakpointsMet = numBreakpoints
      }
      setNumBreakpointsMet(numBreakpointsMet);

      const breakpointsLeft = quest.breakpoints[1].slice(numBreakpointsMet);
      numDiceLeft.current = breakpointsLeft.length === 0 ? 0 : breakpointsLeft.reduce((prev, current) => prev + current);

      if (onNumDiceChange) {
        const totalNumDice = quest.breakpoints[1].reduce((prev, current) => prev + current);
        onNumDiceChange(quest.name, totalNumDice - numDiceLeft.current, numDiceLeft.current);
      }
    },
    [numBreakpoints, quest, onNumDiceChange]
  )

  useEffect(() => {
    numDiceLeft.current = quest.breakpoints[1].reduce((prev, current) => prev + current)
  },[quest])

  return (
    <div className="flex flex-col gap-y-2 max-w-2xs">
      <div className="flex gap-2">
        <div className="flex-1 flex gap-1">
          <div className="font-bold whitespace-nowrap text-purple-800 dark:text-purple-300">{quest.name}</div>
          <div className="group inline-block">
            <button className="bg-gray-400 dark:bg-gray-500 px-2 rounded-xl hover:bg-teal-600 transition duration-300 ease-in-out transform hover:scale-105">?</button>
            <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute max-w-48 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-lg z-10">
              <p className="px-2 py-1 wrap">
                {`Breakpoints: ${quest.breakpoints[0].join(', ')}`}
              </p>
            </div>
          </div>
        </div>
        <div>{`Dice Left: ${numDiceLeft.current}`}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-[120px]">
          <IntegerInput name="progressInput" placeholder={quest.placeholderText} onValueChange={handleProgressChange} />
        </div>
        <div className="flex-1">
          <ProgressBar percentDone={Math.round(numBreakpointsMet/numBreakpoints*100)} />
        </div>
      </div>
    </div>
  )
}

export default function WhereAreDiceContent() {
  const rotation = useRef<Rotations>(Rotations.None);
  const [rotationQuests, setQuestRotations] = useState<Quest[]>([]);
  const [nonRollingDice, setNonRollingDice] = useState(new Map<string, [number,number]>());

  const handleRotationChange = (event: SelectChangeEvent<number>) => {
    rotation.current = event.target.value as number;
    setQuestRotations(quests.get(rotation.current) ?? []);
  };

  const onNumDiceChange = (key: string, diceEarned: number, diceLeft: number) => {
    setNonRollingDice(oldMap => {
      const newMap = new Map(oldMap);
      newMap.set(key, [diceEarned, diceLeft]);
      return newMap;
    })
  }

  useEffect(() => {
    if (!rotationQuests) {
      setNonRollingDice(new Map());
    }
    else {
      setNonRollingDice(new Map(rotationQuests
        .filter(quest => !quest.fromRolling)
        .map(quest => ([quest.name, [0, quest.breakpoints[1].reduce((prev, current) => prev + current)]]))
      ))
    }
  }, [rotationQuests])

  const totalDice = nonRollingDice.size > 0 ? 
    [...nonRollingDice.values()].reduce((prev, current) => [prev[0] + current[0], prev[1] + current[1]]) :
    [0, 0];
  return (
    <div>
      <div>
        <div className="py-2 w-xs">
          <FormControl fullWidth size="small">
            <InputLabel id="rotation-label">Rotation</InputLabel>
            <Select
              labelId="rotation-label"
              id="rotation-select"
              value={rotation.current}
              label="Rotation"
              onChange={handleRotationChange}
            >
              <MenuItem value={1}>Keys</MenuItem>
              <MenuItem value={2}>Wishes</MenuItem>
              <MenuItem value={3}>Shovels</MenuItem>
            </Select>
          </FormControl>
        </div>
        {rotationQuests && <>
          <h3 className="text-lg font-semibold">Quests that you can complete without rolling</h3>
          <p className="pb-2">{`These quests affects your Points per Initial Dice (PPID) as it adds to your '# of Starting Dice'.`}</p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-4 border-b border-dashed border-gray-600 pb-2">
            {rotationQuests.filter(quest => !quest.fromRolling).map((quest, index) => (
              <Row key={index} quest={quest} onNumDiceChange={onNumDiceChange}/>
            ))}
          </div>
          <div className="flex gap-2 font-bold text-xl pb-8">
            <p className="w-[200px]">{`Dice Earned: ${totalDice[0]}`}</p>
            <p>{`Dice Left: ${totalDice[1]}`}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quests that you complete while rolling</h3>
            <p className="pb-2">These quests give you free dice from just rolling.</p>
            <ul className="list-disc ms-5">
              {rotationQuests.filter(quest => quest.fromRolling).map((quest, index) => (
                <li key={index}>
                  <strong>{quest.name} Quest</strong>: {quest.breakpoints[1].reduce((prev, current) => prev + current)} dice available with breakpoints ranging from {quest.breakpoints[0][0]} to {quest.breakpoints[0][quest.breakpoints[0].length-1]}
                </li>
              ))}
              <li><strong>Rolling Around Board</strong>: There are a few tiles on the board that gives free dice when you land on them</li>
            </ul>
          </div>
        </>}
      </div>
    </div>
  )
}