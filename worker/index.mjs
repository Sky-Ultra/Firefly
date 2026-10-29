export { PrivateArticleBackend } from "./private-store.mjs";

import { privateRequest } from "./gateway.mjs";
export default { fetch: privateRequest };
