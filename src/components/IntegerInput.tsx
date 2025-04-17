"use client"
import { ChangeEvent, useCallback, useState } from "react";

type IntegerInputProps = {
  name: string;
  placeholder?: string
  onValueChange?: (value: number) => void;
}
export const IntegerInput = (props: IntegerInputProps) => {
  const { name, placeholder, onValueChange } = props;
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      if (!onValueChange) { return; }
      let newValue = parseInt(event.target.value);
      if (isNaN(newValue)) {
        newValue = 0;
      };
      onValueChange(newValue);
    },
    [onValueChange]
  );

  return (
    <input
      name={name}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      onChange={handleChange}
      value={value}
      className="bg-transparent w-full p-2 rounded-sm leading-tight shadow ring-1 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600" placeholder={placeholder}
    />
  )
}
