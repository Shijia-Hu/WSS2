function matchesSavedId(question, savedId) {
    return question.qid === savedId || question.legacyQuestion === savedId || question.question === savedId;
}

export function deriveRemovedQuestions(basePool, masterPool) {
    const remaining = new Set(masterPool.map(q => q.qid ?? q.question ?? q.legacyQuestion));
    return basePool
        .filter(q => !remaining.has(q.qid ?? q.question ?? q.legacyQuestion))
        .map(q => q.qid ?? q.question ?? q.legacyQuestion);
}

export function applyRemovedQuestions(basePool, removed = []) {
    if (!Array.isArray(removed) || removed.length === 0) return [...basePool];
    const removedSet = new Set(removed);
    return basePool.filter(q => !removedSet.has(q.qid ?? q.question ?? q.legacyQuestion)
        && !removed.some((entry) => matchesSavedId(q, entry)));
}

export function rebuildSelection(basePool, savedSelection = []) {
    if (!Array.isArray(savedSelection)) return [];
    const poolMap = new Map(basePool.map(q => [q.qid ?? q.question ?? q.legacyQuestion, q]));
    return savedSelection
        .map((entry) => {
            if (!entry || (entry.qid == null && !entry.question)) return null;
            const source = poolMap.get(entry.qid ?? entry.question)
                || basePool.find((q) => matchesSavedId(q, entry.question))
                || entry;
            return {
                ...JSON.parse(JSON.stringify(source)),
                soulColor: entry.soulColor || "var(--elphaba)",
                uid: entry.uid || Date.now() + Math.random(),
            };
        })
        .filter(Boolean);
}

export function calculateTimerFromState(timerState, now = Date.now()) {
    if (!timerState || typeof timerState !== "object") return null;
    let remaining = Number(timerState.remaining ?? 0);
    const max = Number(timerState.max ?? remaining);
    if (timerState.running && timerState.updatedAt) {
        const elapsed = (now - timerState.updatedAt) / 1000;
        remaining = Math.max(0, remaining - elapsed);
    }
    return {
        remaining,
        max: Math.max(max, remaining),
        running: Boolean(timerState.running) && remaining > 0,
    };
}
