export type PostListLayout = "list" | "grid" | "masonry";
export const POST_LAYOUT_ORDER_REVISION = "row-order-2026-11-09";
/** Migrate the former default once, then preserve explicit later choices. */
export function readPostLayoutPreference(
	storage: Pick<Storage, "getItem" | "setItem">,
	desktop: boolean,
): PostListLayout | null {
	try {
		let saved = storage.getItem("postListLayout");
		if (
			desktop &&
			storage.getItem("postListOrderRevision") !== POST_LAYOUT_ORDER_REVISION
		) {
			if (saved === "masonry") {
				saved = "grid";
				storage.setItem("postListLayout", saved);
			}
			storage.setItem("postListOrderRevision", POST_LAYOUT_ORDER_REVISION);
		}
		return saved === "list" || saved === "grid" || saved === "masonry"
			? saved
			: null;
	} catch {
		return null;
	}
}
