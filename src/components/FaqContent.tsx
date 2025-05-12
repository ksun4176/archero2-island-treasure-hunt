import { basePath } from "@/utils/constants";
import Image from "next/image";
import React from "react";

type QuestionProps = {
  question: string;
  answer?: React.ReactNode;
}
const Question = (props: QuestionProps) => {
  const { question, answer } = props;
  return <div className="py-8 lg:grid lg:grid-cols-4 lg:gap-8">
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
              Based on our estimates, this pack is worth <strong><u>at least</u></strong> 1100 gems.
            </p>
            <div className="mb-2">
              <h6 className="underline">Math:</h6>
              <p>Average for 100k points:</p>
              <UnorderedList items={[
                "Number of Dice Needed: 269",
                "Points Rewards: 55k gems (40k from loot + 10k from mythic artifact + 5k from treasure coin)",
                "Gems Gotten: 2771.18 gems",
                "Chroma Keys Gotten: 4.16 keys",
              ]} />
              <p>Value of a single dice: (55k gems + 2771.18 gems + 4.16 keys * 400 gems) / 269 dice = <strong>220 gems</strong></p>
            </div>
          </>}
        />
        <Question
          question="Why aim for 100k points?"
          answer={<>
            <div className="mb-2">
              <p>Hitting 100k points strikes the best balance between breakpoint rewards AND ranking rewards.</p>
              <UnorderedList items={[
                <>Going straight for 100k (while skipping events) <strong><u>instead</u></strong> of aiming for 20k every time gives you ~3 more treasure coins, plus extra treasure coins from better rankings.</>,
                <>Hitting 100k twice <strong><u>instead</u></strong> of 200k once earns you ~10 more artifact shards, at the cost of only ~2 treasure coins.</>,
              ]} />
            </div>
            <p>
              <strong><u>Caveat:</u></strong> It might be worth spending a little bit extra dice to get higher rank rewards but that is up to you.
            </p>
          </>}
        />
        <Question
          question="Is there a particular rotation that is better?"
          answer={<>
            <div className="mb-2">
              <p>
                Each event rotation focuses on a single resource for the week. You can use that resource to get more dice AND you can roll dice to earn more of that resource. Each rotation also includes a matching artifact as a reward. <br/>
                The event rotations are: <br/>
              </p>
              <UnorderedList items={[
                "Chroma Keys and Goldfinger Artifact",
                "Wishes and Golden Fleece Artifact",
                "Shovels and Golden Mask Artifact"
              ]} />
            </div>
            <p>
              We recommend prioritizing getting all three artifacts first to complete the set bonus. Once that is done, shift focus to only the Chroma Key rotation as they are the best resource and Goldfinger is the best artifact.
            </p>
          </>}
        />
        <Question
          question="What should I buy in the exchange shop?"
          answer={<>
            <div className="mb-2">
              <OrderedList items={[
                `Cupid's Bow: Cheap, costs only 2 tickets (was available for free during Valentine's event).`,
                `Cupid's Arrow: Completes the set and works across all modes. Worth starring as Dragoon helmet user because of built in burn damage.`,
                `Demon Artifacts: Only used in PVP BUT the mode offers valuable rewards,`,
                `Epic Char Shards: A good way to get it f2p (only Seraph and Dracoola though).`,
                `Otta Shards: Only available in this shop although he is seeing minimum resonance use only in PVP.`,
                `Rare Char Shards: Just avoid them—they are not worth it.`,
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
              href="https://github.com/ksun4176/archero2-island-treasure-hunt-sim"
              target="blank_"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Simulation Github Repo
            </a> <br />
            If you have any questions, feel free to reach out to @kaithulhu_ on Discord. <br />
          </p>}
        />
      </dl>
    </div>
  )
}