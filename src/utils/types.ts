export type Quest = {
  name: string;
  breakpoints: [number[],number[]];
  placeholderText: string;
  fromRolling?: boolean;
  optional?: boolean;
}