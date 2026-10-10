import assert from "node:assert/strict";
import test from "node:test";
import { announcementConfig } from "../src/config/announcementConfig";

test("公告使用指定欢迎文案，保留关于我的入口", () => {
	assert.equal(announcementConfig.content, "Hi，我喜欢你呀！！");
	assert.equal(announcementConfig.link?.url, "/about/");
	assert.equal(announcementConfig.link?.enable, true);
});
