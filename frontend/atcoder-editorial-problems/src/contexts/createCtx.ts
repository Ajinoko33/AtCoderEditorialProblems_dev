import { createContext, useContext } from 'react';

export const createCtx = <T>() => {
  const ctx = createContext<T | null>(null);

  const useCtx = () => {
    const c = useContext(ctx);
    if (c === null) {
      throw new Error('useCtx must be inside a Provider with a value');
    }
    return c;
  };

  return [useCtx, ctx.Provider] as const;
};
