"use client"
import MultiplierMapContent from "@/components/MultiplierMapContent";
import WhereAreDiceContent from "@/components/WhereAreDiceContent";
import ShouldRollContent from "@/components/ShouldRollContent";
import PpidCalcContent from "@/components/PpidCalculatorContent";
import TipsForNewContent from "@/components/TipsForNewContent";
import FaqContent from "@/components/FaqContent";
import { IconButton } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import MenuIcon from '@mui/icons-material/Menu';
import Image from "next/image";
import { JSX, useState } from "react";
import { basePath } from "@/utils/constants";

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
      <div className="flex items-center gap-2 p-2 bg-gray-300 dark:bg-gray-600 sticky top-[0] z-1">
        <div className="grow-0 md:hidden">
          <IconButton
            size="small"
            aria-label="open sidebar"
            onClick={toggleSidebar(!sidebarOpen)}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <div className="grow-0">
          <Image
            className="w-[36px]"
            src={`${basePath}/diceicon.png`}
            alt="Island Treasure Hunt"
            height={177}
            width={151}
            unoptimized
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:gap-1">
          <h1 className="font-semibold text-2xl">Island Treasure Hunt</h1>
          <p className="text-sm">by Kaithulhu</p>
        </div>
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
          <div className="text-3xl p-2 bg-gray-100 dark:bg-gray-800 ">
            {"Down until VIP Discord access is given to a few key community helpers to ensure those who contribute and care about the community have a direct line to the developers."}
          </div>
        </div>
        {/* <div className="flex-1 flex flex-col h-full">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 ">
            {sections.map((section, index) =>
              <div id="container" key={index} className="w-full flex flex-col mb-8">
                <h2
                  id={section.href}
                  className="font-semibold text-2xl border-b border-gray-500 mb-1 -mt-13 pt-13 pointer-events-none"
                >
                  {section.heading}
                </h2>
                {section.content}
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  )
}
