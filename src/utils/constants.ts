import { Quest } from "./types";

export const basePath = "/archero2-island-treasure-hunt";
export enum QuestNames {
  KillBosses = "Kill Bosses",
  KillMinions = "Kill Minions",
  GoldCave = "Gold Cave",
  DailyLogin = "Daily Login",
  ClaimAfkRewards = "Claim AFK Rewards",
  SealBattle = "Seal Battles",
  Arena = "Arena",
  IslandPack2 = "Island Pack 2",
  IslandPack3 = "Island Pack 3",
  UseGems = "Use Gems",
  Keys = "Keys",
  Wishes = "Wishes",
  Shovels = "Shovels",
  RollDice = "Roll Dice",
  GettingPoints = "Getting Points",
}

export const quests: Quest[] = [
  {
    name: QuestNames.KillBosses,
    breakpoints: [
      [5, 10, 20, 30],
      Array(4).fill(1)
    ],
    placeholderText: "# Killed",
  },
  {
    name: QuestNames.KillMinions,
    breakpoints: [
      Array(4).fill(0).map((_v, index) => (index+1) * 500),
      Array(4).fill(1)
    ],
    placeholderText: "# Killed",
  },
  {
    name: QuestNames.GoldCave,
    breakpoints: [
      Array(4).fill(0).map((_v, index) => (index+1) * 2),
      Array(4).fill(2)
    ],
    placeholderText: "# Done",
  },
  {
    name: QuestNames.DailyLogin,
    breakpoints: [
      Array(5).fill(0).map((_v, index) => (index+1)),
      Array(5).fill(2)
    ],
    placeholderText: "# Days",
  },
  {
    name: QuestNames.ClaimAfkRewards,
    breakpoints: [
      [3, 5, 10, 15, 20],
      Array(5).fill(1)
    ],
    placeholderText: "# Collected",
  },
  {
    name: QuestNames.SealBattle,
    breakpoints: [
      Array(5).fill(0).map((_v, index) => (index+1) * 2),
      Array(5).fill(2)
    ],
    placeholderText: "# Done",
  },
  {
    name: QuestNames.Arena,
    breakpoints: [
      [3, 6, 10, 15, 20, 30],
      Array(6).fill(1)
    ],
    placeholderText: "# Done",
  },
  {
    name: QuestNames.IslandPack2,
    breakpoints: [
      Array(7).fill(0).map((_v, index) => (index+1)),
      Array(7).fill(1)
    ],
    placeholderText: "# Bought",
  },
  {
    name: QuestNames.IslandPack3,
    breakpoints: [
      Array(7).fill(0).map((_v, index) => (index+1)),
      Array(7).fill(5)
    ],
    placeholderText: "# Bought",
  },
  {
    name: QuestNames.UseGems,
    breakpoints: [
      [200, 500, 1000, 2000, 3000, 4000, 6000, 8000, 10000],
      [1, 1, 1, 2, 2, 2, 2, 2, 2]
    ],
    placeholderText: "# Used",
  },
  {
    name: QuestNames.Keys,
    breakpoints: [
      [1, 2, 3, 5, 10, 15, 20],
      [1, 1, 1, 1, 2, 2, 2]
    ],
    placeholderText: "# Used",
  },
  {
    name: QuestNames.Wishes,
    breakpoints: [
      [1, 2, 3, 5, 10, 15, 20],
      [2, 2, 2, 2, 2, 2, 2]
    ],
    placeholderText: "# Used",
  },
  {
    name: QuestNames.Shovels,
    breakpoints: [
      [2, 4, 6, 10, 20, 30, 40],
      [2, 2, 2, 2, 2, 2, 2]
    ],
    placeholderText: "# Used",
  },
  {
    name: QuestNames.RollDice,
    breakpoints: [
      [5, 10, 20, 30, 40, 60, 80, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600],
      [1, 2, 2, 2, 2, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
    ],
    placeholderText: "# Rolled",
    fromRolling: true,
  },
  {
    name: QuestNames.GettingPoints,
    breakpoints: [
      Array(5).fill(0).flatMap((_v, index) => [2000, 5000, 8000, 12000, 16000, 20000].map(v => v + index*20000)),
      Array(30).fill(2)
    ],
    placeholderText: "# Gotten",
    fromRolling: true,
  }
];

export enum LinkId {
  ppid = 'ppid-def'
}