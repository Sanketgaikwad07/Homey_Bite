export const buildAuthHeader = (token) => {
  const rawToken = (token || '').trim();
  if (!rawToken) {
    return {};
  }
  return {
    Authorization: rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`
  };
};
