import { useCallback, useState } from 'react';

export type Range = [number, number];
export type UpdateRangeHandler = (newRange: number[]) => void;

export const useRange = (defalutValue: Range) => {
  const [range, setRange] = useState<Range>(defalutValue);

  const updateRange: UpdateRangeHandler = useCallback((newRange: number[]) => {
    setRange([newRange[0], newRange[1]]);
  }, []);

  return [range, updateRange] as const;
};
