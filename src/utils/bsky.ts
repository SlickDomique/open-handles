export const getUserProfile = async (did: string) => {
  const response = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${did}`
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
  const json = await response.json();
  return {
    status: response.status,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    json,
  };
};
