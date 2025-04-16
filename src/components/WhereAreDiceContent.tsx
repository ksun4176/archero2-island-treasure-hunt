'use client'
import { ChangeEvent, useCallback, useRef, useState } from "react";

type Quest = {
  name: string;
  breakpoints: [number[],number[]];
  fromRolling?: boolean;
  optional?: boolean;
}

const quests: Quest[] = [
  {
    name: "Kill Bosses",
    breakpoints: [
      [5, 10, 20, 30],
      Array(4).fill(1)
    ]
  },
  {
    name: "Kill Minions",
    breakpoints: [
      Array(4).fill(0).map((_v, index) => (index+1) * 500),
      Array(4).fill(1)
    ]
  },
  {
    name: "Gold Cave",
    breakpoints: [
      Array(4).fill(0).map((_v, index) => (index+1) * 2),
      Array(4).fill(2)
    ]
  },
  {
    name: "Daily Login",
    breakpoints: [
      Array(5).fill(0).map((_v, index) => (index+1)),
      Array(5).fill(2)
    ]
  },
  {
    name: "Claim AFK Rewards",
    breakpoints: [
      [3, 5, 10, 15, 20],
      Array(5).fill(1)
    ]
  },
  {
    name: "Seal Battles",
    breakpoints: [
      Array(5).fill(0).map((_v, index) => (index+1) * 2),
      Array(5).fill(2)
    ]
  },
  {
    name: "Arena",
    breakpoints: [
      [3, 6, 10, 15, 20, 30],
      Array(6).fill(1)
    ]
  },
  {
    name: "Island Pack 2",
    breakpoints: [
      Array(7).fill(0).map((_v, index) => (index+1)),
      Array(7).fill(1)
    ]
  },
  {
    name: "Island Pack 3",
    breakpoints: [
      Array(7).fill(0).map((_v, index) => (index+1)),
      Array(7).fill(5)
    ]
  },
  {
    name: "Use Gems",
    breakpoints: [
      [200, 500, 1000, 2000, 3000, 4000, 6000, 8000, 10000],
      [1, 1, 1, 2, 2, 2, 2, 2, 2]
    ]
  },
  {
    name: "Keys",
    breakpoints: [
      [1, 2, 3, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ],
    optional: true
  },
  {
    name: "Wishes",
    breakpoints: [
      [1, 2, 3, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ],
    optional: true
  },
  {
    name: "Shovels",
    breakpoints: [
      [2, 4, 6, 10, 20, 30, 40, 60, 80, 100, 120, 140, 160, 180, 200],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ],
    optional: true
  },
  {
    name: "Roll Dice",
    breakpoints: [
      [5, 10, 20, 30, 40, 60, 80, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600],
      [1, 2, 2, 2, 2, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
    ],
    fromRolling: true
  },
  {
    name: "Getting Points",
    breakpoints: [
      Array(5).fill(0).flatMap((_v, index) => [2000, 5000, 8000, 12000, 16000, 20000].map(v => v + index*20000)),
      Array(30).fill(2)
    ],
    fromRolling: true
  },
]

type IntegerInputProps = {
  id?: string;
  onValueChange?: (value: number) => void;
}
const IntegerInput = (props: IntegerInputProps) => {
  const { id, onValueChange } = props;
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      if (!onValueChange) { return; }
      let newValue = parseInt(event.target.value);
      if (isNaN(newValue)) {
        newValue = 0;
      };
      onValueChange(newValue);
    },
    [onValueChange]
  );

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      onChange={handleChange}
      value={value}
      className="bg-transparent w-[72px] px-2 rounded-sm ring-1 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
    />
  )
}

type ProgressBarProps = {
  percentDone: number;
}
const ProgressBar = (props: ProgressBarProps) => {
  const { percentDone } = props;

  return (
    <div className="w-full max-w-40 h-full bg-gray-200 rounded-sm overflow-hidden dark:bg-neutral-700" role="progressbar" aria-valuenow={percentDone} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-sm overflow-hidden bg-blue-600 transition duration-500 dark:bg-blue-500"  style={{ width: `${percentDone}%` }} />
    </div>
  )
}

type RowProps = {
  quest: Quest;
  onNumDiceChange?: (key: string, numDice: number) => void;
}
const Row = (props: RowProps) => {
  const { quest, onNumDiceChange } = props;
  const [includeRow, setIncludeRow] = useState(!quest.optional);
  const [numBreakpointsMet, setNumBreakpointsMet] = useState(0);
  const numDiceLeft = useRef(quest.breakpoints[1].reduce((prev, current) => prev + current))

  const numBreakpoints = quest.breakpoints[0].length;
  const handleCheckboxChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setIncludeRow(isChecked);

      if (onNumDiceChange) {
        onNumDiceChange(quest.name, isChecked ? numDiceLeft.current : 0)
      }
    },
    []
  );

  const handleProgressChange = useCallback(
    (newValue: number) => {
      let numBreakpointsMet = quest.breakpoints[0].findIndex(bp => bp > newValue);
      if (numBreakpointsMet === -1) { //all completed
        numBreakpointsMet = numBreakpoints
      }
      setNumBreakpointsMet(numBreakpointsMet);

      const breakpointsLeft = quest.breakpoints[1].slice(numBreakpointsMet);
      numDiceLeft.current = breakpointsLeft.length === 0 ? 0 : breakpointsLeft.reduce((prev, current) => prev + current);

      if (includeRow && onNumDiceChange) {
        onNumDiceChange(quest.name, numDiceLeft.current);
      }
    },
    []
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-y-2 gap-x-1 border-b first:border-t border-gray-700 py-1">
      <div className="font-bold">
        {quest.name}
      </div>
      <div className="col-span-2 flex gap-2">
        <fieldset className="flex gap-1">
          <label htmlFor="progressInput">Progress:</label>
          <IntegerInput id="progressInput" onValueChange={handleProgressChange}/>
        </fieldset>
        <ProgressBar percentDone={Math.round(numBreakpointsMet/numBreakpoints*100)}/>
      </div>
      <div>{`Dice Left: ${numDiceLeft.current}`}</div>
      {quest.optional && <fieldset className="flex gap-1">
        <label htmlFor="includeCheckbox">
          Include in Total?
        </label>
        <input
          id="includeCheckbox"
          type="checkbox"
          checked={includeRow}
          onChange={handleCheckboxChange} />
      </fieldset>}
    </div>
  )
}

export default function WhereAreDiceContent() {
  const [nonRollingTotalDice, setNonRollingTotalDice] = useState(new Map<string, number>(
    quests
      .filter(quest => !quest.fromRolling && !quest.optional)
      .map(quest => ([quest.name, quest.breakpoints[1].reduce((prev, current) => prev + current)]))
  ));

  const onNumDiceChange = (key: string, numDice: number) => {
    setNonRollingTotalDice(oldMap => {
      const newMap = new Map(oldMap);
      newMap.set(key, numDice);
      return newMap;
    })
  }

  return (
    <div>
      <div className="pb-8 ">
        <h3 className="text-lg font-semibold">Quests that you can complete without rolling</h3>
        <p className="pb-2">These quests affects your Points per Initial Dice (PPID) as it adds to your '# of Starting Dice'.</p>
        <div className="flex flex-col">
          {quests.filter(quest => !quest.fromRolling).map((quest, index) => (
            <Row key={index} quest={quest} onNumDiceChange={onNumDiceChange}/>
          ))}
        </div>
        <div className="font-bold text-lg">
          {`Total: ${[...nonRollingTotalDice.values()].reduce((prev, current) => prev + current)}`}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Quests that you complete while rolling</h3>
        <p className="pb-2">These quests give you free dice from just rolling.</p>
        <ul className="list-disc ms-5">
          {quests.filter(quest => quest.fromRolling).map((quest, index) => (
            <li key={index}>
              <strong>{quest.name} Quest</strong>: {quest.breakpoints[1].reduce((prev, current) => prev + current)} dice available with breakpoints ranging from {quest.breakpoints[0][0]} to {quest.breakpoints[0][quest.breakpoints[0].length-1]}
            </li>
          ))}
          <li><strong>Rolling Around Board</strong>: There are a few tiles on the board that gives free dice when you land on them</li>
        </ul>
      </div>
    </div>
  )
}