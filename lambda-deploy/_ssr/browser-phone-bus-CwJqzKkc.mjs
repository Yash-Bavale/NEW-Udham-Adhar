let ready = false;
let handler = null;
let controls = null;
const listeners = /* @__PURE__ */ new Set();
const browserPhone = {
  isReady: () => ready,
  setReady(v) {
    if (ready !== v) {
      ready = v;
      listeners.forEach((l) => l());
    }
  },
  subscribe(l) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  register(h) {
    handler = h;
  },
  dial(r) {
    if (!ready || !handler) return false;
    handler(r);
    return true;
  },
  setControls(c) {
    controls = c;
  },
  /** Current browser phone state, or null when the phone is not mounted. */
  state: () => controls?.state() ?? null,
  answer() {
    if (controls?.state() !== "RINGING") return false;
    controls.answer();
    return true;
  },
  reject() {
    if (controls?.state() !== "RINGING") return false;
    controls.reject();
    return true;
  },
  hangup() {
    const s = controls?.state();
    if (s !== "CONNECTED" && s !== "CALLING") return false;
    controls.hangup();
    return true;
  }
};
export {
  browserPhone as b
};
