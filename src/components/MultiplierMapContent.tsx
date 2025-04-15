import Image from "next/image";

type Question = {
  question: string;
  olAnswer?: string[];
}

type QuestionProps = {
  text: string;
}
const Question = (props: QuestionProps) => {
  const { text } = props;
  return <h3 className="font-bold">{text}</h3>
}

type OrderedListProps = {
  items: string[];
}
const OrderedList = (props: OrderedListProps) => {
  const { items } = props;
  return <ol className="list-decimal ms-5">
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ol>
}

export default function Home() {
  return (
    <div id="container" className="w-full flex flex-col md:flex-row">
      <div className="mr-8 mb-8 md:mb-0">
        <Image
          className="min-w-[200px] max-w-[350px]"
          src="/multipliermap.png"
          alt="Multiplier Map"
          height={663}
          width={436}
          priority
          unoptimized
        />
      </div>
        <div className="w-full md:w-[60%] lg:w-[50%]">
          <div>
            <Question text="How do I use this map?" />
            <div className="mb-2">
              <OrderedList items={[
                  "Check the map for the tile you are on",
                  "Change your multiplier to match the tile on the map (go as high as you can if you cannot do 10x)",
                  "Roll",
                  "Repeat",
                ]}
              />
            </div>
          </div>
          <div>
            <Question text="How did we come up with this map?" />
            <div className="mb-2">
              <OrderedList items={[
                  "Calculated the expected value of each tile based on its points value and probability of getting dice.",
                  "Compute the projected value of each tile by factoring in the expected value of reachable tiles.",
                  "Toggled tiles—starting with those with the highest projected value—to 10x in order to maximize overall PPID.",
                  "Ran 10k simulated event runs on the finalized map to validate our approach.",
                ]}
              />
            </div>
          </div>
          <div>
            <Question text="Did we try other maps?" />
            <div className="mb-2">
              <OrderedList items={[
                  "We ran simulations on several other proposed maps, but ours outperformed them.",
                  "We also explored \"safer\" maps with lower variance, but none offered a worthwhile tradeoff in efficiency.",
                ]}
              />
            </div>
          </div>
        </div>
    </div>
  );
}