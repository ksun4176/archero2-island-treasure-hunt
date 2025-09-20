import FaqContent from '@/components/FaqContent';
import TipsForNewContent from '@/components/TipsForNewContent';
import { basePath } from '@/utils/constants';
import Image from 'next/image';
import { JSX } from 'react';

type Section = {
  href: string;
  label: string;
  heading: React.ReactNode;
  content?: JSX.Element;
};

const sections: Section[] = [
  {
    href: 'tips-for-newbies',
    label: 'Tips for Newbies',
    heading: (
      <>
        Tips for Newbies <span className='whitespace-nowrap'>◕⩊◕</span>
      </>
    ),
    content: <TipsForNewContent />,
  },
  // {
  //   href: 'where-are-the-dice',
  //   label: 'Where are the dice?!',
  //   heading: (
  //     <>
  //       Where are the dice?!{' '}
  //       <span className='whitespace-nowrap'>(╯°□°)╯︵ ┻━┻</span>
  //     </>
  //   ),
  //   content: <WhereAreDiceContent />,
  // },
  // {
  //   href: 'multiplier-map',
  //   label: 'Multiplier Map',
  //   heading: (
  //     <>
  //       Multiplier Map <span className='whitespace-nowrap'>( • ̀ω•́ )✧</span>
  //     </>
  //   ),
  //   content: <MultiplierMapContent />,
  // },
  // {
  //   href: 'should-i-roll',
  //   label: 'Should I roll?',
  //   heading: (
  //     <>
  //       Should I roll? <span className='whitespace-nowrap'>¯\\_(ツ)_/¯</span>
  //     </>
  //   ),
  //   content: <ShouldRollContent />,
  // },
  // {
  //   href: 'ppid-calculator',
  //   label: 'PPID Calculator',
  //   heading: (
  //     <>
  //       Points per Dice Calculator{' '}
  //       <span className='whitespace-nowrap'>◁ |⚙⌨⚙| ▷</span>
  //     </>
  //   ),
  //   content: <PpidCalcContent />,
  // },
  {
    href: 'faq',
    label: 'FAQs',
    heading: (
      <>
        FAQs <span className='whitespace-nowrap'>(º～º)</span>
      </>
    ),
    content: <FaqContent />,
  },
];

export default function Home() {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // const toggleSidebar = (newOpen: boolean) => () => {
  //   setSidebarOpen(newOpen);
  // };

  return (
    <div className='flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]'>
      <div className='flex items-center gap-2 p-2 bg-gray-300 dark:bg-gray-600 sticky top-0 z-1'>
        {/* <div className='grow-0 md:hidden'>
          <IconButton
            size='small'
            aria-label='open sidebar'
            onClick={toggleSidebar(!sidebarOpen)}
          >
            <MenuIcon />
          </IconButton>
        </div> */}
        <div className='grow-0'>
          <Image
            className='w-[36px]'
            src={`${basePath}/diceicon.png`}
            alt='Island Treasure Hunt'
            height={177}
            width={151}
            unoptimized
          />
        </div>
        <div className='flex-1 flex flex-col md:flex-row md:items-center md:gap-1'>
          <h1 className='font-semibold text-2xl'>Island Treasure Hunt</h1>
        </div>
        <div className='hidden md:block'>
          <a
            href='https://ko-fi.com/O4O71FBM0I'
            target='_blank'
          >
            <Image
              height={36}
              width={143}
              className='h-[36px] w-[143px] border-0'
              src='https://storage.ko-fi.com/cdn/kofi5.png?v=6'
              alt='Buy Me a Coffee at ko-fi.com'
              unoptimized
            />
          </a>
        </div>
      </div>
      {/* Sidebar */}
      {/* <Drawer
        open={sidebarOpen}
        onClose={toggleSidebar(false)}
      >
        <div className='p-2'>
          <div className='text-xl font-semibold'>Table of content</div>
          <ul className='mt-2 list-disc pr-2 pl-6'>
            {sections.map((section) => (
              <li key={section.href}>
                <a
                  className='block hover:bg-gray-200 dark:hover:bg-gray-900 px-2 py-1 rounded'
                  href={`#${section.href}`}
                  onClick={toggleSidebar(false)}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Drawer> */}
      <div className='flex flex-col items-center h-full gap-2 py-2 md:px-2'>
        {/* Table of Content */}
        {/* <div className='grow-0 bg-gray-100 dark:bg-gray-800 p-2 rounded sticky top-13 hidden md:block'>
          <div className='text-xl font-semibold'>Table of content</div>
          <ul className='mt-2 list-disc pr-2 pl-6'>
            {sections.map((section) => (
              <li key={section.href}>
                <a
                  className='block hover:bg-gray-200 dark:hover:bg-gray-900 px-2 py-1 rounded'
                  href={`#${section.href}`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div> */}
        {/* Content */}
        <div className='text-xl font-semibold p-2 bg-yellow-100 dark:bg-yellow-700'>
          <p>
            This page is no longer being maintained so information might be
            outdated. Last updated July 2025.
          </p>
          <p>
            Check out the new{' '}
            <a
              href='https://ksun4176.github.io/archero2-dice-companion/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 dark:text-blue-400 underline'
            >
              Archero2 Dice Companion with Guide
            </a>{' '}
            instead.
          </p>
        </div>
        <div className='flex-1 flex flex-col h-full'>
          <div className='p-2 bg-gray-100 dark:bg-gray-800 '>
            {sections.map((section, index) => (
              <div
                id='container'
                key={index}
                className='w-full flex flex-col mb-8'
              >
                <h2
                  id={section.href}
                  className='font-semibold text-2xl border-b border-gray-500 mb-1 -mt-18 pt-18 md:-mt-13 md:pt-13 pointer-events-none'
                >
                  {section.heading}
                </h2>
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className='flex justify-end p-2 block md:hidden sticky bottom-0'>
        <a
          href='https://ko-fi.com/O4O71FBM0I'
          target='_blank'
        >
          <Image
            height={36}
            width={143}
            className='h-[36px] w-[143px] border-0'
            src='https://storage.ko-fi.com/cdn/kofi5.png?v=6'
            alt='Buy Me a Coffee at ko-fi.com'
            unoptimized
          />
        </a>
      </div>
    </div>
  );
}
