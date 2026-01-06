import assert from "node:assert/strict";
import {
    applyRemovedQuestions,
    calculateTimerFromState,
    deriveRemovedQuestions,
    rebuildSelection,
} from "../src/progress.js";

const basePool = [
    { qid: 1, legacyQuestion: "Q1", questionPrimary: "Q1", optionsPrimary: ["A", "B"], correct: 0 },
    { qid: 2, legacyQuestion: "Q2", questionPrimary: "Q2", optionsPrimary: ["C", "D"], correct: 1 },
    { qid: 3, legacyQuestion: "Q3", questionPrimary: "Q3", optionsPrimary: ["E", "F"], correct: 0 },
];

const masterPool = [basePool[0], basePool[2]];

const removed = deriveRemovedQuestions(basePool, masterPool);
assert.deepEqual(removed, [2]);

const pruned = applyRemovedQuestions(basePool, removed);
assert.deepEqual(pruned.map(q => q.qid), [1, 3]);

const rebuilt = rebuildSelection(basePool, [
    { qid: 2, soulColor: "var(--glinda)", uid: 123 },
]);
assert.equal(rebuilt.length, 1);
assert.equal(rebuilt[0].qid, 2);
assert.equal(rebuilt[0].optionsPrimary[0], "C");
assert.equal(rebuilt[0].soulColor, "var(--glinda)");
assert.equal(rebuilt[0].uid, 123);

const now = 1_000_000;
const timerState = calculateTimerFromState({
    remaining: 10,
    max: 20,
    running: true,
    updatedAt: now - 5_000,
}, now);
assert.ok(timerState);
assert.equal(Math.round(timerState.remaining), 5);
assert.equal(timerState.max, 20);
assert.equal(timerState.running, true);

const stoppedState = calculateTimerFromState({
    remaining: 0,
    max: 20,
    running: true,
    updatedAt: now - 5_000,
}, now);
assert.ok(stoppedState);
assert.equal(stoppedState.remaining, 0);
assert.equal(stoppedState.running, false);

console.log("progress tests passed");
