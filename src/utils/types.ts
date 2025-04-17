export type DataRow = {
  startingDice: number;
  breakpoint: number;
  chance: number | null;
}

export type Quest = {
  name: string;
  breakpoints: [number[],number[]];
  placeholderText: string;
  fromRolling?: boolean;
  optional?: boolean;
}