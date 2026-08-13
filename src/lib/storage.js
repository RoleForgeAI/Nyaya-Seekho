/* Thin wrapper over window.localStorage that mirrors the async
   { key, value, shared } shape the component expects — matches the
   shim that was hand-written into the old esbuild standalone build. */

export const storage = {
  async get(key) {
    const value = window.localStorage.getItem(key);
    if (value === null) throw new Error("No note saved yet for this section.");
    return { key, value, shared: false };
  },
  async set(key, value) {
    window.localStorage.setItem(key, value);
    return { key, value, shared: false };
  },
};
