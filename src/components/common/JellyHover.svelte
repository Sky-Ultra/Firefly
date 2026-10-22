<script lang="ts">
import type { Snippet } from "svelte";
import type { JellyProfile } from "@/utils/jelly-hover-motion";

interface Props {
	children: Snippet;
	profile?: JellyProfile;
	enabled?: boolean;
	class?: string;
}
let {
	children,
	profile = "card",
	enabled = true,
	class: className = "",
}: Props = $props();
</script>

{#if enabled}
	<jelly-hover data-jelly-profile={profile} class={className}>{@render children()}</jelly-hover>
{:else}
	{@render children()}
{/if}
