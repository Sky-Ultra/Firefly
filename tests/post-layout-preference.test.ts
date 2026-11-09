import assert from "node:assert/strict";
import test from "node:test";
import {
	POST_LAYOUT_ORDER_REVISION,
	readPostLayoutPreference,
} from "../src/utils/post-layout-preference";

function storage(value?: string) {
	const map = new Map<string, string>();
	if (value) map.set("postListLayout", value);
	return {
		getItem: (key: string) => map.get(key) ?? null,
		setItem: (key: string, v: string) => {
			map.set(key, v);
		},
		map,
	};
}
test("old desktop masonry preference migrates once, future explicit choices survive", () => {
	const s = storage("masonry");
	assert.equal(readPostLayoutPreference(s, true), "grid");
	assert.equal(s.map.get("postListOrderRevision"), POST_LAYOUT_ORDER_REVISION);
	s.setItem("postListLayout", "masonry");
	assert.equal(readPostLayoutPreference(s, true), "masonry");
});
test("list/grid preferences and mobile preferences are preserved", () => {
	for (const mode of ["list", "grid"]) {
		assert.equal(readPostLayoutPreference(storage(mode), true), mode);
	}
	const s = storage("masonry");
	assert.equal(readPostLayoutPreference(s, false), "masonry");
	assert.equal(s.map.has("postListOrderRevision"), false);
});
test("unavailable storage and invalid modes fall back to the configured default", () => {
	assert.equal(readPostLayoutPreference(storage("invalid"), true), null);
	assert.equal(
		readPostLayoutPreference(
			{
				getItem: () => {
					throw Error("blocked");
				},
				setItem: () => {},
			},
			true,
		),
		null,
	);
});
