"use client"
import MultiplierMapContent from "@/components/MultiplierMapContent";
import WhereAreDiceContent from "@/components/WhereAreDiceContent";
import ShouldRollContent from "@/components/ShouldRollContent";
import PpidCalcContent from "@/components/PpidCalculatorContent";
import { IconButton } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import MenuIcon from '@mui/icons-material/Menu';
import { JSX, useState } from "react";
import TipsForNewContent from "@/components/TipsForNewContent";
import FaqContent from "@/components/FaqContent";

type Section = {
  href: string;
  label: string;
  heading: React.ReactNode;
  content?: JSX.Element;
}

const sections: Section[] = [
  {
    href: "multiplier-map",
    label: "Multiplier Map",
    heading: <>Multiplier Map <span className="whitespace-nowrap">( • ̀ω•́ )✧</span></>,
    content: <MultiplierMapContent />,
  },
  {
    href: "where-are-the-dice",
    label: "Where are the dice?!",
    heading: <>Where are the dice?! <span className="whitespace-nowrap">(╯°□°)╯︵ ┻━┻</span></>,
    content: <WhereAreDiceContent />,
  },
  {
    href: "should-i-roll",
    label: "Should I roll?",
    heading: <>Should I roll? <span className="whitespace-nowrap">¯\\_(ツ)_/¯</span></>,
    content: <ShouldRollContent />,
  },
  {
    href: "ppid-calculator",
    label: "PPID Calculator",
    heading: <>Points per Dice Calculator <span className="whitespace-nowrap">◁ |⚙⌨⚙| ▷</span></>,
    content: <PpidCalcContent />,
  },
  {
    href: "tips-for-newbies",
    label: "Tips for Newbies",
    heading: <>Tips for Newbies <span className="whitespace-nowrap">◕⩊◕</span></>,
    content: <TipsForNewContent />,
  },
  {
    href: "faq",
    label: "FAQs",
    heading: <>FAQs <span className="whitespace-nowrap">(º～º)</span></>,
    content: <FaqContent />,
  }
]

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (newOpen: boolean) => () => {
    setSidebarOpen(newOpen);
  };

return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="flex p-2 bg-gray-300 dark:bg-gray-600 sticky top-[0] z-1">
        <div className="md:hidden">
          <IconButton
            size="small"
            aria-label="open sidebar"
            onClick={toggleSidebar(!sidebarOpen)}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <h1 className="font-semibold text-3xl">Island Treasure Hunt Guide</h1>
      </div>
      {/* Sidebar */}
      <Drawer open={sidebarOpen} onClose={toggleSidebar(false)}>
        <div className="p-2">
          <div className="text-xl font-semibold">Table of content</div>
          <ul className="mt-2 list-disc pr-2 pl-6">
            {sections.map(section => 
              <li key={section.href}>
                <a 
                  className="block hover:bg-gray-200 dark:hover:bg-gray-900 px-2 py-1 rounded"
                  href={`#${section.href}`}
                  onClick={toggleSidebar(false)}
                >
                  {section.label}
                </a>
              </li>
            )}
          </ul>
        </div>
      </Drawer>
      <div className="flex items-start h-full gap-2 py-2 md:px-2">
        {/* Table of Content */}
        <div className="grow-0 bg-gray-100 dark:bg-gray-800 p-2 rounded sticky top-13 hidden md:block">
          <div className="text-xl font-semibold">Table of content</div>
          <ul className="mt-2 list-disc pr-2 pl-6">
            {sections.map(section => 
              <li key={section.href}>
                <a
                  className="block hover:bg-gray-200 dark:hover:bg-gray-900 px-2 py-1 rounded"
                  href={`#${section.href}`}
                >
                  {section.label}
                </a>
              </li>
            )}
          </ul>
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col h-full">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 ">
            {sections.map((section, index) =>
              <div id="container" key={index} className="w-full flex flex-col mb-8">
                <h2
                  id={section.href}
                  className="font-semibold text-2xl border-b border-gray-500 mb-1 -mt-[50px] pt-[50px] pointer-events-none"
                >
                  {section.heading}
                </h2>
                {section.content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
