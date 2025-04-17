type OrderedListProps = {
  items: React.ReactNode[];
}
const OrderedList = (props: OrderedListProps) => {
  const { items } = props;
  return <ol className="list-decimal ms-5 flex flex-col gap-1">
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ol>
}

export default function TipsForNewContent() {
  return (
    <div id="container" className="w-full flex flex-col">
      <div>
        <div className="mb-2">
          <OrderedList items={[
              <><strong>Save your dice</strong> between events to aim for higher points goals.</>,
              <><strong>Multipliers</strong> are unlocked as you collect more dice. They let you get more rewards from a single roll BUT it will cost you just as many dice (20 dice = 2x, 30 dice = 3x, 50 dice = 5x, 100 dice = 10x).</>,
              <><strong>Save gems for this event</strong> (unless there is a clearly better event announced). This is one of the best events to be spending your dice (Island Pack 3, Mythstone Chests, etc.)</>,
              <><strong>Once you are past 150k power</strong>, we strongly recommend saving resources to maximize number of dice you get from each rotation (Chroma Keys, Wishes, Shovels).</>,
              <strong>Read the FAQs.</strong>,
              "Check out the rest of the guide as hopefully they make more sense now.",
              <>
                {`Ask questions on `}
                <a
                  href="https://discord.gg/archero2"
                  target="blank_"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Archero 2 Discord
                </a>.
              </>
            ]}
          />
        </div>
      </div>
    </div>
  );
}