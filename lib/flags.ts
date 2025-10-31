export const FLAGS = {
  live: process.env.USE_LIVE_DATA === 'true',
  demo: process.env.DEMO_MODE === 'true',
};

export async function choose<T>(liveFn: () => Promise<T>, demoFn: () => Promise<T>) {
  return FLAGS.live ? liveFn() : demoFn();
}
