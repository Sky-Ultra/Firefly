<script lang="ts">
import JellyHover from "@/components/common/JellyHover.svelte";

interface Filter {
	value: string;
	label: string;
	count?: number;
}

interface Props {
	filters: Filter[];
	activeFilter: string;
	onFilterChange: (filter: string) => void;
}

const { filters, activeFilter, onFilterChange }: Props = $props();
</script>

<div class="flex flex-wrap gap-1.5 mb-4">
  {#each filters as filter}
	<JellyHover profile="control">
    <button
      data-jelly-surface
      class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 {filter.value === activeFilter
        ? 'bg-(--primary) text-white shadow-md'
        : 'bg-(--btn-regular-bg) text-(--btn-content) hover:bg-(--btn-regular-bg-hover)'}"
      onclick={() => onFilterChange(filter.value)}
      type="button"
    >
      {filter.label}
      {#if filter.count !== undefined}
        <span class="ml-1">({filter.count})</span>
      {/if}
    </button>
	</JellyHover>
  {/each}
</div>
