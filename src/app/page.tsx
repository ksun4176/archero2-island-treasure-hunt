import MultiplierMapContent from "@/components/MultiplierMapContent";
import { JSX } from "react";

type Section = {
  href: string;
  label: string;
  content?: JSX.Element;
}

const sections: Section[] = [
  {
    href: "multiplier-map",
    label: "Multiplier Map",
    content: <MultiplierMapContent />
  },
  {
    href: "where-are-the-dice",
    label: "Where are the dice?! (╯°□°)╯︵ ┻━┻",
  },
  {
    href: "should-i-roll",
    label: "Should I roll? ¯\\_(ツ)_/¯"
  },
  {
    href: "ppid-calculator",
    label: "Points per Initial Dice Calculator"
  },
  {
    href: "tips-for-new-users",
    label: "Tips for New Users"
  },
  {
    href: "faq",
    label: "FAQs (º～º)"
  }
]

export default function Home() {
  return (
    <div className="grid min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="justify-self-center">
        <h1 className="font-bold text-3xl">Island Treasure Hunt Guide</h1>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-800 px-4 py-3 text-left break-words max-w-md rounded">
        <div className="mx-auto text-xl font-semibold"><strong>Table of content</strong></div>
        <ul className="mt-2 list-disc px-2 pl-6">
          {sections.map(section => 
            <li key={section.href}>
              <a className="block hover:bg-gray-200 dark:hover:bg-gray-900 px-2 py-1 rounded" href={`#${section.href}`}>{section.label}</a>
            </li>
          )}
        </ul>
      </div>
      {sections.map(section =>
        <div id="container" key={section.href} className="w-full flex flex-col">
          <h2 id={section.href} className="font-bold text-2xl">{section.label}</h2>
          {section.content}
        </div>
      )}
    </div>
  )
}
