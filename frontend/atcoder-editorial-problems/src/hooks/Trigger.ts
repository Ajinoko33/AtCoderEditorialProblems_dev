import { useCallback, useState } from 'react';

export type PullTriggerHandler = () => void;

export const useTrigger = () => {
  const [trigger, setTrigger] = useState<boolean>(false);

  const pullTrigger: PullTriggerHandler = useCallback(() => {
    setTrigger((preTrigger) => !preTrigger);
  }, []);

  return [trigger, pullTrigger] as const;
};
