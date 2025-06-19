import { Autumn } from "./client";

export const staticWrapper = <TArgs extends Record<string, any>, TReturn>(
  callback: (params: { instance: Autumn } & TArgs) => Promise<TReturn>,
  instance: Autumn | undefined,
  args: TArgs
): Promise<TReturn> => {
  if (!instance) {
    instance = new Autumn();
  }

  return callback({ instance, ...args });
};
