import { describe, expect, it } from "vitest";
import {
  NODES, EDGES, anchor, pathD,
  activeBranchesFor, mainDoneEdgesFor, edgeState, nodeState,
  NODE_W, NODE_H,
} from "@/lib/orders/journey-graph";
import {
  derivePhase, getActiveDelayBranchKey, PHASE_ENABLED_BUTTONS,
} from "@/lib/orders/journey-map";

/* ─── Geometry ─── */
describe("geometry helpers", () => {
  const n = { id: "x", x: 100, y: 200, label: "", icon: "inbox" as const, kind: "stage" as const, tone: "indigo" as const };
  it("computes anchors on each side", () => {
    expect(anchor(n, "L")).toEqual({ x: 100, y: 200 + NODE_H / 2 });
    expect(anchor(n, "R")).toEqual({ x: 100 + NODE_W, y: 200 + NODE_H / 2 });
    expect(anchor(n, "T")).toEqual({ x: 100 + NODE_W / 2, y: 200 });
    expect(anchor(n, "B")).toEqual({ x: 100 + NODE_W / 2, y: 200 + NODE_H });
  });
  it("builds paths for each mode", () => {
    const a = { x: 0, y: 0 }, b = { x: 10, y: 20 };
    expect(pathD(a, b, "S")).toBe("M 0 0 L 10 20");
    expect(pathD(a, b, "HV")).toBe("M 0 0 L 10 0 L 10 20");
    expect(pathD(a, b, "VH")).toBe("M 0 0 L 0 20 L 10 20");
    expect(pathD(a, b, "HVH")).toBe("M 0 0 L 5 0 L 5 20 L 10 20");
    expect(pathD(a, b, "VHV")).toBe("M 0 0 L 0 10 L 10 10 L 10 20");
  });
  it("uses waypoints when provided", () => {
    expect(pathD({ x: 0, y: 0 }, { x: 5, y: 5 }, "S", [{ x: 2, y: 2 }]))
      .toBe("M 0 0 L 2 2 L 5 5");
  });
});

/* ─── Graph shape snapshot ─── */
describe("graph shape", () => {
  it("keeps every edge endpoint pointing at a real node", () => {
    const ids = new Set(NODES.map((n) => n.id));
    for (const e of EDGES) {
      expect(ids.has(e.from), `edge ${e.id} from`).toBe(true);
      expect(ids.has(e.to), `edge ${e.id} to`).toBe(true);
    }
  });
  it("has unique node ids", () => {
    expect(new Set(NODES.map((n) => n.id)).size).toBe(NODES.length);
  });
  it("has unique edge ids", () => {
    expect(new Set(EDGES.map((e) => e.id)).size).toBe(EDGES.length);
  });
});

/* ─── activeBranchesFor per phase ─── */
describe("activeBranchesFor", () => {
  it("form_not_submitted → form-nag", () => {
    expect([...activeBranchesFor("form_not_submitted", null, null)]).toEqual(["form-nag"]);
  });
  it("form_submitted → no branch", () => {
    expect([...activeBranchesFor("form_submitted", null, null)]).toEqual([]);
  });
  it("technical_delay → technical", () => {
    expect([...activeBranchesFor("technical_delay", null, null)]).toEqual(["technical"]);
  });
  it("customer_delay → customer-delay", () => {
    expect([...activeBranchesFor("customer_delay", null, null)]).toEqual(["customer-delay"]);
  });
  it("consultation_done → shortcut", () => {
    expect([...activeBranchesFor("consultation_done", null, null)]).toEqual(["shortcut"]);
  });
  it("awaiting_govt → awaiting", () => {
    expect([...activeBranchesFor("awaiting_govt", null, null)]).toEqual(["awaiting"]);
  });
  it("status_checked → status", () => {
    expect([...activeBranchesFor("status_checked", null, null)]).toEqual(["status"]);
  });
  it("post_wait_submitted → status + accept", () => {
    const s = activeBranchesFor("post_wait_submitted", null, null);
    expect(s.has("status")).toBe(true);
    expect(s.has("accept")).toBe(true);
  });
  it("completed terminal → accept", () => {
    expect(activeBranchesFor("completed", "completed", null).has("accept")).toBe(true);
  });
  it("closed reason A → form-nag", () => {
    expect([...activeBranchesFor("closed", "closed", "A7")]).toEqual(["form-nag"]);
  });
  it("closed reason A + customer workflow → customer-delay", () => {
    expect([...activeBranchesFor("closed", "closed", "A3", "customer_hold")]).toEqual(["customer-delay"]);
  });
  it("closed waiting_for_customer workflow → customer-delay", () => {
    expect([...activeBranchesFor("closed", "closed", "A3", "waiting_for_customer")]).toEqual(["customer-delay"]);
  });
  it("closed reason B → reject", () => {
    expect([...activeBranchesFor("closed", "closed", "B4")]).toEqual(["reject"]);
  });
});

/* ─── customer-delay phase from workflow status ─── */
describe("customer delay workflow status", () => {
  it("maps waiting_for_customer to the customer-delay branch", () => {
    expect(getActiveDelayBranchKey("waiting_for_customer")).toBe("customer-side-delay");
  });
  it("maps external_dependency to the customer-delay branch", () => {
    expect(getActiveDelayBranchKey("external_dependency")).toBe("customer-side-delay");
  });
  it("derives customer_delay phase after B10 is submitted", () => {
    expect(derivePhase({
      stage: "form_submitted",
      workflowStatus: "waiting_for_customer",
    })).toBe("customer_delay");
  });
  it("keeps the standard next-step buttons available after B10 is submitted", () => {
    expect(PHASE_ENABLED_BUTTONS.customer_delay).toEqual(["B02", "B04", "B05", "B08", "B09"]);
  });
});

/* ─── mainDoneEdgesFor ─── */
describe("mainDoneEdgesFor", () => {
  it("stops at form_not while form_not_submitted", () => {
    const s = mainDoneEdgesFor(3, "form_not_submitted");
    // idx 2 clamp → only e_or_fn
    expect([...s]).toEqual(["e_or_fn"]);
  });
  it("freezes at form_sub while technical_delay", () => {
    const s = mainDoneEdgesFor(4, "technical_delay");
    expect(s.has("e_or_fn")).toBe(true);
    expect(s.has("e_fn_fs")).toBe(true);
    expect(s.has("e_fs_gv")).toBe(false);
  });
  it("progresses normally when not holding", () => {
    expect(mainDoneEdgesFor(6, "completed").size).toBe(5);
  });
});

/* ─── edgeState ─── */
describe("edgeState", () => {
  const findEdge = (id: string) => EDGES.find((e) => e.id === id)!;

  it("marks form-nag closed when terminal=closed reason A", () => {
    const branches = activeBranchesFor("closed", "closed", "A7");
    const done = mainDoneEdgesFor(2, "closed");
    expect(edgeState(findEdge("e_b01_cl"), { activeBranches: branches, doneMainEdges: done, terminal: "closed" }))
      .toBe("closed");
  });
  it("marks technical loop active during technical_delay", () => {
    const branches = activeBranchesFor("technical_delay", null, null);
    const done = mainDoneEdgesFor(3, "technical_delay");
    expect(edgeState(findEdge("e_b02_b03"), { activeBranches: branches, doneMainEdges: done, terminal: null }))
      .toBe("active");
  });
  it("marks main-3 done after form_submitted transitions past it", () => {
    const branches = activeBranchesFor("consultation_done", null, null);
    const done = mainDoneEdgesFor(4, "consultation_done");
    expect(edgeState(findEdge("e_fs_gv"), { activeBranches: branches, doneMainEdges: done, terminal: null }))
      .toBe("done");
  });
  it("marks unrelated edge idle", () => {
    const branches = activeBranchesFor("customer_delay", null, null);
    const done = mainDoneEdgesFor(3, "customer_delay");
    expect(edgeState(findEdge("e_b02_b03"), { activeBranches: branches, doneMainEdges: done, terminal: null }))
      .toBe("idle");
  });
});

/* ─── nodeState ─── */
describe("nodeState", () => {
  it("completed terminal", () => {
    const branches = activeBranchesFor("completed", "completed", null);
    expect(nodeState("completed", { currentIdx: 6, activeBranches: branches, terminal: "completed", phase: "completed" }))
      .toBe("terminal-ok");
  });
  it("closed terminal", () => {
    const branches = activeBranchesFor("closed", "closed", "B4");
    expect(nodeState("closed_e010", { currentIdx: 3, activeBranches: branches, terminal: "closed", phase: "closed" }))
      .toBe("terminal-bad");
  });
  it("active node incident to live branch", () => {
    const branches = activeBranchesFor("customer_delay", null, null);
    expect(nodeState("b10_cust", { currentIdx: 3, activeBranches: branches, terminal: null, phase: "customer_delay" }))
      .toBe("active");
  });
  it("done stage below current index", () => {
    const branches = activeBranchesFor("awaiting_govt", null, null);
    expect(nodeState("order_recv", { currentIdx: 4, activeBranches: branches, terminal: null, phase: "awaiting_govt" }))
      .toBe("done");
  });
  it("idle otherwise", () => {
    const branches = activeBranchesFor("form_submitted", null, null);
    expect(nodeState("b09_reject", { currentIdx: 3, activeBranches: branches, terminal: null, phase: "form_submitted" }))
      .toBe("idle");
  });
});
