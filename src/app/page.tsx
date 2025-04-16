"use client"
import MultiplierMapContent from "@/components/MultiplierMapContent";
import WhereAreDiceContent from "@/components/WhereAreDiceContent";
import { IconButton } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import MenuIcon from '@mui/icons-material/Menu';
import { JSX, useState } from "react";

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
    label: "Where are the dice?!",
    content: <WhereAreDiceContent />
  },
  {
    href: "should-i-roll",
    label: "Should I roll?"
  },
  {
    href: "ppid-calculator",
    label: "PPID Calculator"
  },
  {
    href: "tips-for-new-users",
    label: "Tips for New Users"
  },
  {
    href: "faq",
    label: "FAQs"
  }
]

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (newOpen: boolean) => () => {
    setSidebarOpen(newOpen);
  };

return (
    <div className="flex items-start min-h-screen gap-2 p-4 font-[family-name:var(--font-geist-sans)]">
      {/* Sidebar */}
      <Drawer open={sidebarOpen} onClose={toggleSidebar(false)}>
        <div className="p-4">
          <div className="mx-auto text-xl font-semibold"><strong>Table of content</strong></div>
          <ul className="mt-2 list-disc px-2 pl-6">
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
      {/* Table of Content */}
      <div className="grow-0 shrink-0 basis-3xs hidden sm:block">
        <div className="bg-gray-100 dark:bg-gray-800 w-3xs px-4 py-3 break-words rounded fixed">
          <div className="mx-auto text-xl font-semibold">Table of content</div>
          <ul className="mt-2 list-disc px-2 pl-6">
            {sections.map(section => 
              <li key={section.href}>
                <a className="block hover:bg-gray-200 dark:hover:bg-gray-900 px-2 py-1 rounded" href={`#${section.href}`}>{section.label}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="flex-[0_0_40px] sm:hidden">
        <IconButton
          size="medium"
          aria-label="open sidebar"
          onClick={toggleSidebar(!sidebarOpen)}
          sx={{ position: 'fixed' }}
        >
          
          <MenuIcon />
        </IconButton>
      </div>
      {/* Content */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-800 h-full">
        <h1 className="font-bold text-3xl border-b border-gray-400 mb-8">Island Treasure Hunt Guide</h1>
        <div className="m-2">
          {sections.map(section =>
            <div id="container" key={section.href} className="w-full flex flex-col mb-8">
              <h2 id={section.href} className="font-semibold text-2xl border-b border-gray-500 mb-1">{section.label}</h2>
              {section.content}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
