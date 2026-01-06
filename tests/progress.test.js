import assert from "node:assert/strict";
import {
    applyRemovedQuestions,
    calculateTimerFromState,
    deriveRemovedQuestions,
    rebuildSelection,
} from "../src/progress.js";

const basePool = [
    { question: "Q1", options: ["A", "B"], correct: 0 },
    { question: "Q2", options: ["C", "D"], correct: 1 },
    { question: "Q3", options: ["E", "F"], correct: 0 },
];

const masterPool = [basePool[0], basePool[2]];

const removed = deriveRemovedQuestions(basePool, masterPool);
assert.deepEqual(removed, ["Q2"]);

const pruned = applyRemovedQuestions(basePool, removed);
assert.deepEqual(pruned.map(q => q.question), ["Q1", "Q3"]);

const rebuilt = rebuildSelection(basePool, [
    { question: "Q2", soulColor: "var(--glinda)", uid: 123 },
]);
assert.equal(rebuilt.length, 1);
assert.equal(rebuilt[0].question, "Q2");
assert.equal(rebuilt[0].options[0], "C");
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
