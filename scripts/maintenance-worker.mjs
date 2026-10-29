import { maintenanceResponse } from "./maintenance-page.mjs";

// run_worker_first=true ensures posts, files, subprojects and worker origins
// receive the same offline response. No path or query can bypass this guard.
export default {
	fetch(request) {
		return maintenanceResponse(request);
	},
};
