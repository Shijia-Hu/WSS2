export function deriveRemovedQuestions(basePool, masterPool) {
    const remaining = new Set(masterPool.map(q => q.question));
    return basePool.filter(q => !remaining.has(q.question)).map(q => q.question);
}

export function applyRemovedQuestions(basePool, removed = []) {
    if (!Array.isArray(removed) || removed.length === 0) return [...basePool];
    const removedSet = new Set(removed);
    return basePool.filter(q => !removedSet.has(q.question));
}

export function rebuildSelection(basePool, savedSelection = []) {
    if (!Array.isArray(savedSelection)) return [];
    const poolMap = new Map(basePool.map(q => [q.question, q]));
    return savedSelection
        .map((entry) => {
            if (!entry || !entry.question) return null;
            const source = poolMap.get(entry.question) || entry;
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
