import { T as TypeSafeClient, n as noul } from "../_libs/typesafe-ai__sdk.mjs";
function getTypeSafeClient() {
  const apiKey = process.env.TYPESAFE_API_KEY?.trim();
  if (!apiKey) return null;
  return new TypeSafeClient({ apiKey });
}
async function rerankWithSystemOne(query, candidates, options) {
  const q = query.trim();
  if (!q || candidates.length === 0) return candidates;
  const client = getTypeSafeClient();
  if (!client) {
    return candidates;
  }
  const max = options?.maxCandidates ?? 25;
  const pool = candidates.slice(0, max);
  const remaining = candidates.slice(max);
  const timeoutMs = options?.timeoutMs ?? 3e3;
  try {
    const questions = {};
    for (let i = 0; i < pool.length; i++) {
      const c = pool[i];
      questions[`c_${i}`] = noul({
        instructions: {
          search_query: q,
          candidate_record: {
            kind: c.kind ?? "record",
            title: c.title,
            name: c.name ?? null,
            service: c.service ?? null,
            status_or_stage: c.stage ?? null,
            summary: c.subtitle ?? null,
            extra: c.details ?? null
          },
          task: "Evaluate whether this candidate record is what the staff member is searching for in the query."
        },
        criteria: {
          true: "The candidate record specifically satisfies the query intent, entity name, service, status, or identifier.",
          false: "The candidate record is irrelevant or only tangentially matches a generic word."
        }
      });
    }
    const evaluationPromise = client.systemOne({
      state: {
        staff_search_query: q,
        total_candidates: pool.length
      },
      questions
    });
    const timeoutPromise = new Promise(
      (_, reject) => setTimeout(() => reject(new Error("TypeSafe rerank timeout")), timeoutMs)
    );
    const result = await Promise.race([evaluationPromise, timeoutPromise]);
    const scoredPool = pool.map((item, idx) => {
      const ans = result.answers[`c_${idx}`];
      const relevance = ans && ans.type === "noul" ? ans.noul : 0.5;
      return {
        ...item,
        relevanceScore: relevance
      };
    });
    scoredPool.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
    return [...scoredPool, ...remaining];
  } catch (err) {
    console.warn("[TypeSafe Rerank] System One evaluation skipped/failed:", err instanceof Error ? err.message : err);
    return candidates;
  }
}
async function filterRemindersForEmployee(userId, isAdmin, reminders) {
  if (reminders.length === 0) return [];
  const directMatches = reminders.filter(
    (r) => r.assigned_to === userId || r.created_by === userId
  );
  if (!isAdmin) {
    return directMatches;
  }
  const unassigned = reminders.filter((r) => !r.assigned_to && r.created_by !== userId);
  return [...directMatches, ...unassigned];
}
export {
  filterRemindersForEmployee,
  getTypeSafeClient,
  rerankWithSystemOne
};
