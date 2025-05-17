import MonopolyMap from '@/components/MonopolyMap';
import { LinkId } from '@/utils/constants';
import { ReactNode } from 'react';

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
  label: ReactNode;
  stat: ReactNode;
}
const statsFor100k: Stat[] = [
  {
    label: '# of Starting Dice',
    stat: 269
  },
  {
    label: <a
      href={`#${LinkId.ppid}`}
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      PPID
    </a>,
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
        <div className="mb-4">
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
        <div className="mb-4">
          <Question text="What is the benefit of this map?" />
          <div>
            <p>{`
              This map is not the most efficient one to get to 100k (it requires 0.25 dice more), but in return, you get on average 0.4 extra chromatic keys and 280 gems.
              For us, that small tradeoff is totally worth it.
            `}</p>
            <p>{`
              Now you might be thinking—are there maps that use more dice but give even bigger rewards?
              Yep, there are. But we still think this one's the best overall.
              Dice are super important since they are the only way to get treasure coins and grab those exclusive Island Store loot.
              We do not want people using a bunch of extra dice in one go and then not having enough saved up for the next run.
            `}</p>
          </div>
        </div>
        <div className="mb-4">
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
        <div className="mb-4">
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

      <div className="mx-auto lg:ml-4 mb-4 lg:mb-0">
        <MonopolyMap multipliers={[1,1,1,1,1,1,1,1,10,10,1,1,1,1,1,1,1,1,1,1,10,10,10,1]} />
        <p className="text-sm">Credit to zaddydaddy and Fierywind</p>
      </div>
    </div>
  );
}