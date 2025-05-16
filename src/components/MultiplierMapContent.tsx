import { basePath } from "@/utils/constants";
import Image from "next/image";
import MonopolyMap from '@/components/MonopolyMap';

type Question = {
  question: string;
}

type QuestionProps = {
  text: string;
}
const Question = (props: QuestionProps) => {
  const { text } = props;
  return <h3 className="font-bold">{text}</h3>
}

type OrderedListProps = {
  items: React.ReactNode[];
}
const OrderedList = (props: OrderedListProps) => {
  const { items } = props;
  return <ol className="list-decimal ms-5 flex flex-col gap-1">
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ol>
}

type Stat = {
  label: string;
  stat: number;
}
const statsFor100k: Stat[] = [
  {
    label: '# of Starting Dice',
    stat: 269
  },
  {
    label: 'PPID',
    stat: 388.91
  },
  {
    label: 'Total Rolls Completed',
    stat: 490
  },
  {
    label: 'PPR',
    stat: 209.39
  },
  {
    label: '# of Leftover Dice',
    stat: 5.19
  },
  {
    label: 'Gems Gotten',
    stat: 2771.18
  },
  {
    label: 'Chroma Key Gotten',
    stat: 4.16
  },
  {
    label: 'Otta Shards Gotten',
    stat: 0.53
  }
]

export default function MultiplierMapContent() {
  return (
    <div id="container" className="w-full flex flex-col-reverse lg:flex-row">
      <div className="flex-1">
        <div className="mb-2">
          <Question text="How do I use this map?" />
          <div>
            <OrderedList items={[
                "Check the map for the tile you are on",
                "Change your multiplier to match the tile on the map (go as high as you can if you cannot do 10x)",
                "Roll",
                "Repeat",
              ]}
            />
          </div>
        </div>
        <div className="mb-2">
          <Question text="How did we come up with this map?" />
          <div>
            <OrderedList items={[
                "Calculated the expected value of each tile based on its points value and probability of getting dice.",
                "Compute the projected value of each tile by factoring in the expected value of reachable tiles.",
                "Toggled tiles—starting with those with the highest projected value—to 10x in order to maximize overall PPID.",
                "Ran 10k simulated event runs on the finalized map to validate our approach.",
              ]}
            />
          </div>
        </div>
        <div className="mb-2">
          <Question text="Did we try other maps?" />
          <div>
            <OrderedList items={[
                "We ran simulations on several other proposed maps, but ours outperformed them.",
                "We also explored \"safer\" maps with lower variance, but none offered a worthwhile tradeoff in efficiency.",
              ]}
            />
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-700 max-w-3xs mx-auto lg:ml-0">
          <thead>
            <tr className="bg-gray-400 dark:bg-gray-700">
              <th className="p-1 text-center" colSpan={2}>Average for 100k points</th>
            </tr>
          </thead>
          <tbody>
            {statsFor100k.map((stat, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="p-1">{stat.label}</td>
                <td className="p-1">{stat.stat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MonopolyMap multipliers={[1,1,1,1,1,1,1,10,10,1,1,1,1,1,1,1,1,1,1,10,10,10,1,1]} />
      {/*<MonopolyMap multipliers={[1,2,3,5,10,5,3,2,1,2,3,5,10,5,3,2,1,2,3,5,10,5,3,2]} />*/}

      {/*<div className="mx-auto lg:ml-4 mb-4 lg:mb-0">*/}
      {/*  <Image*/}
      {/*    className="w-[350px]"*/}
      {/*    src={`${basePath}/multipliermap.png`}*/}
      {/*    alt="Multiplier Map"*/}
      {/*    height={1767}*/}
      {/*    width={1664}*/}
      {/*    priority*/}
      {/*    unoptimized*/}
      {/*  />*/}
      {/*  <p className="text-sm">Credit to zaddydaddy and Fierywind</p>*/}
      {/*</div>*/}
    </div>
  );
}