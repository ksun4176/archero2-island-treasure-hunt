import { basePath, LinkId } from "@/utils/constants";
import Image from "next/image";
import React from "react";

type QuestionProps = {
  question: string;
  answer?: React.ReactNode;
  id?: string;
}
const Question = (props: QuestionProps) => {
  const { id, question, answer } = props;
  return <div id={id} className="py-8 lg:grid lg:grid-cols-4 lg:gap-8">
    <dt className="font-semibold">{question}</dt>
    <dd className="lg:col-span-3 mt-4 lg:mt-0 *:text-gray-900 *:dark:text-gray-300">{answer}</dd>
  </div>
}

type ListProps = {
  items: React.ReactNode[];
}
const OrderedList = (props: ListProps) => {
  const { items } = props;
  return <ol className="list-decimal ms-5 flex flex-col gap-1">
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ol>
}

const UnorderedList = (props: ListProps) => {
  const { items } = props;
  return <ol className="list-disc ms-5 flex flex-col gap-1">
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ol>
}

export default function FaqContent() {
  return (
    <div>
      <dl className="divide-y divide-gray-900/10">
        <Question
          id={LinkId.ppid}
          question="What is Points per Dice (PPID)?"
          answer={<>
            <p className="mb-2 pl-2 -indent-2">
              PPID is calculated as:<br />
              = Total Points / Number of Dice BEFORE Any Rolling<br />
              = Total Points / (Start Dice - End Dice)<br />
            </p>
            <div className="mb-2">
              <p>This means it EXCLUDES dice gained from:</p>
              <UnorderedList items={[
                "Roll Dice Tasks",
                "Points Breakpoints",
                "Collecting dice from tiles on the board"
              ]} />
            </div>
            <p className="mb-2">
              <u>Why is this important?</u><br />
              PPID better captures the benefit of collecting extra dice while rolling—something that Points per Roll (PPR) does not fully reflect.<br />
              PPR = Total Points / Total Rolls Done.<br />
            </p>
            <p>
              Take this example:<br />
              We all agree that landing on a 2x dice tile is a win!<br />
              PPR sees it as a <u>negative</u>, since you are ending up with more rolls, which dilutes the score.<br />
              PPID, on the other hand, treats it as a positive—more like a refund. You used a dice but got two back.<br />
            </p>
          </>}
        />
        <Question
          question="Should I buy the Island Pack 3 for 750 gem?"
          answer={<>
            <p className="mb-2">
              Based on our estimates, this pack is worth <strong><u>at least</u></strong> 1350 gems.
            </p>
            <div className="mb-2">
              <h6 className="underline">Math:</h6>
              <p>Average for 100k points:</p>
              <UnorderedList items={[
                "Number of Dice Needed: 269",
                "Points Rewards: 68500 gems (Loot + Mythic Artifact + Treasure Coins)",
                "Gems Gotten: 2700 gems",
                "Chroma Keys Gotten: 2 keys",
                "Wish Coins Gotten: 5 coins",
                "Promised Shovels Gotten: 1 shovel"
              ]} />
              <p>Value of a single dice: (68500 + 2700 + 1135 gems) / 269 dice ≈ <strong>270 gems</strong></p>
            </div>
          </>}
        />
        <Question
          question="Should I play every event or save dice between events?"
          answer={<>
            <div className="mb-2">
              <p>{`Before collecting all golden artifacts, save your dice and only play when you can reach 100k points. This gives you solid breakpoint + ranking rewards and exactly 10 shards—enough to unlock an artifact.`}</p>
              <p>{`Once you have one of each artifact, choose a focus:`}</p>
            </div>
            <div className="mb-2">
              <p>{`🎯 Gear & Keys Focus`}</p>
              <UnorderedList items={[
                <>Aim for 20k points per event</>,
                <>Save remaining dice</>,
                <>Go for 100k points when possible</>,
                <>Average of ~20 more keys/month</>,
              ]} />
            </div>
            <div className="mb-2">
              <p>{`🏺 Artifacts, Treasure Coins & GvG Focus`}</p>
              <UnorderedList items={[
                <>Skip events, save dice and aim for 100k points only</>,
                <>Average of ~2 more treasure coins/month</>,
                <>Average of ~14 more rune shovels/month</>,
                <>Average of ~6 more wish coins/month</>,
                <>Average of ~8 more promised shovels/month</>,
              ]} />
            </div>
            <div>
              <p>Now whether it is worth spending extra dice to go past 100k is totally up to you—but here are a few things to think about:</p>
              <UnorderedList items={[
                "Will you have enough dice to roll comfortably next time you want to play?",
                "Can you hit the next 10k milestone for another guaranteed treasure coin.",
                "Any little gains such as aiming for the next reward tier will be based on your gut feel. Good luck!"
              ]} />
            </div>
          </>}
        />
        <Question
          question="Is there a particular rotation that is better?"
          answer={<>
            <div className="mb-2">
              <p>
                Each event rotation focuses on a single artifact for the week. You can collect shards for that artifact as you meet points milestones. The artifacts rotate between Goldfinger, Golden Fleece, and Golden Mask.<br/>
                We recommend: <br/>
              </p>
              <OrderedList items={[
                "prioritizing getting one of each of the three artifacts first to complete the set bonus",
                "shift focus to get Goldfinger to 8 stars",
                "move to collect star up the other two artifacts equally"
              ]} />
            </div>
          </>}
        />
        <Question
          question="What should I buy in the exchange shop?"
          answer={<>
            <div className="mb-2">
              <UnorderedList items={[
                <><strong>{`Cupid's Bow`}</strong>{`: Cheap, cost only 2 tickets.`}</>,
                <><strong>{`Cupid's Arrow`}</strong>{`: Completes the set and works across all modes. Worth considering getting stars as a Dragoon Helmet user.`}</>,
                <><strong>{`Thronebreaker Shield (PVP only)`}</strong>{`: Cheap, cost only 2 tickets.`}</>,
                <><strong>{`Demon Artifacts (PVP only)`}</strong>{`: Good effects and even better now that GvG is here.`}</>,
                <><strong>{`Otta`}</strong>{`: 2-star is when he starts to shine in PVP and possibly Boss Battles. Only available in this shop and unfortunately requires a longgg-term commitment (200 shards).`}</>,
                <><strong>{`Battle Rite Artifacts (PVP only)`}</strong>{`: Worse effect than Demons and has a meh set bonus.`}</>,
                <><strong>{`Epic Characters`}</strong>{`: A good way to get it although pricey (only Seraph and Dracoola though).`}</>,
                <><strong>{`Rare Characters`}</strong>{`: Just don't.`}</>,
                <><strong>{`If no good options, you should save as they are adding more loot to the store`}</strong></>,
              ]} />
            </div>
            <div>
              <Image
                className="w-[350px]"
                src={`${basePath}/diceshoprecs.png`}
                alt="Island Store recommendations"
                height={1529}
                width={1030}
                priority
                unoptimized
              />
            </div>
          </>}
        />
        <Question
          question="I want to track my run. Is there a tool I can use to do so?"
          answer={<p>
            Yes! Here is a Google sheet you can make a copy of and start tracking your run. <br />
            <a
              href="https://docs.google.com/spreadsheets/d/1PBUKAoNYW5Pi52tNabO_8t_ePqHUEm1vc96faoi2axo"
              target="blank_"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Dice Event Tracker
            </a> <br />
            {`If you want to help out, DM your run to @fierywind on Discord as we are doing a study on people's runs.`}<br />
            If you have any questions, feel free to reach out to @kaithulhu_ on Discord.<br />
          </p>}
        />
        <Question
          question="I think I came up with a better multiplier map. Is there an easy way for me to test it out?"
          answer={<p>
            Yes! You can run the same Python script to simulate the event, where you can test out your new map: <br />
            <a
              href="https://colab.research.google.com/drive/1x8mFXpWvPb4AE8RDYL41t4E9LpIjw500#scrollTo=KsMj1AP8BLmS"
              target="blank_"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Multiplier Map Tester
            </a> <br />
            If you have any questions, feel free to reach out to @kaithulhu_ on Discord. <br />
          </p>}
        />
      </dl>
    </div>
  )
}