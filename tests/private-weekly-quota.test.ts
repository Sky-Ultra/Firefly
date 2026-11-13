import assert from "node:assert/strict";
import test from "node:test";
import {
	counterState,
	counterSummary,
	DAILY_QUOTA,
	finishCounter,
	inheritCounters,
	periodAt,
	quotaPolicyForArticles,
	reserveCounter,
	LETTER_WEEKLY_QUOTA as weekly,
} from "../worker/private-core.mjs";

test("the letter week resets only on Monday 04:00 Beijing, including the exact boundary and year change", () => {
	const before = Date.parse("2026-11-15T19:59:59.999Z");
	const boundary = Date.parse("2026-11-15T20:00:00.000Z");
	assert.equal(periodAt(before, weekly).resetAt, boundary);
	assert.equal(
		periodAt(boundary, weekly).resetAt,
		Date.parse("2026-11-22T20:00:00Z"),
	);
	assert.equal(
		periodAt(Date.parse("2026-11-14T20:00:00Z"), weekly).resetAt,
		boundary,
	);
	assert.equal(
		periodAt(Date.parse("2027-01-01T00:00:00Z"), weekly).resetAt,
		Date.parse("2027-01-03T20:00:00Z"),
	);
	assert.equal(periodAt(before).resetAt, boundary);
	assert.equal(periodAt(boundary).resetAt, Date.parse("2026-11-16T20:00:00Z"));
});

test("the six-error weekly budget survives daily boundaries and resets at the next Monday boundary", () => {
	const now = Date.parse("2026-11-12T08:00:00Z");
	let state = counterState(undefined, now, weekly);
	for (let i = 0; i < 6; i++) {
		const permit = reserveCounter(state, now, String(i), weekly);
		assert.equal(permit.result.ok, true);
		state = finishCounter(
			permit.state,
			now,
			String(i),
			"incorrect",
			weekly,
		).state;
	}
	assert.equal(
		counterSummary(
			counterState(state, now + 86400000, weekly),
			now + 86400000,
			weekly,
		).locked,
		true,
	);
	const before = Date.parse("2026-11-15T19:59:59.999Z");
	assert.equal(
		reserveCounter(state, before, "seventh", weekly).result.ok,
		false,
	);
	const reset = reserveCounter(state, before + 1, "new-week", weekly);
	assert.equal(reset.result.remaining, 6);
	assert.equal(reset.result.ok, true);
});

test("migration keeps today's five failures and pending work, and legacy reconciliation is idempotent", () => {
	const now = Date.parse("2026-11-12T08:00:00Z");
	const daily = {
		period: periodAt(now).period,
		failures: 4,
		pending: { held: now + 1000 },
		inheritedFailures: 2,
	};
	const migrated = counterState(daily, now, weekly);
	assert.equal(migrated.failures, 4);
	assert.equal(migrated.pending.held, now + 1000);
	const expired = counterState(migrated, now + 1001, weekly);
	assert.equal(counterSummary(expired, now + 1001, weekly).remaining, 1);
	assert.equal(counterState(expired, now + 86400000, weekly).failures, 5);
	// An old-version request missing the weekly metadata cannot reset the state.
	assert.equal(
		counterSummary(counterState(expired, now + 86400000), now + 86400000)
			.remaining,
		1,
	);
	const snapshot = [
		{ name: "legacy", state: { ...daily, failures: 2, pending: {} } },
	];
	const first = inheritCounters(expired, now + 1001, snapshot, weekly);
	const again = inheritCounters(first, now + 1001, snapshot, weekly);
	assert.equal(again.failures, 5);
	assert.deepEqual(daily.pending, { held: now + 1000 });
});

test("weekly reservations remain bounded to six and correct or failed service calls never spend errors", () => {
	const now = Date.parse("2026-11-12T08:00:00Z");
	let state = counterState(undefined, now, weekly);
	for (let i = 0; i < 6; i++)
		state = reserveCounter(state, now, String(i), weekly).state;
	assert.equal(
		reserveCounter(state, now, "overflow", weekly).result.reason,
		"busy",
	);
	state = finishCounter(state, now, "0", "correct", weekly).state;
	state = finishCounter(state, now, "1", "error", weekly).state;
	assert.equal(counterSummary(state, now, weekly).remaining, 6);
	assert.equal(reserveCounter(state, now, "released", weekly).result.ok, true);
});

test("password-group policy is shared by members, while unrelated articles retain their daily quota", () => {
	assert.deepEqual(
		quotaPolicyForArticles(["liking", "love-tree-guide"]),
		DAILY_QUOTA,
	);
	assert.deepEqual(quotaPolicyForArticles(["long-night-love-letter"]), weekly);
	assert.deepEqual(
		quotaPolicyForArticles([
			"another-shared-password-article",
			"long-night-love-letter",
		]),
		weekly,
	);
	const now = Date.parse("2026-11-12T08:00:00Z");
	assert.equal(counterSummary(counterState(undefined, now), now).remaining, 5);
});
