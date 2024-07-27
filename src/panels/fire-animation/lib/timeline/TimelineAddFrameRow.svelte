<script lang="ts">
    import { getTimelineContext, Row } from './Timeline'
    import Text from '../../../../lib/components/Text.svelte'

    export let row: Row

    let { collapsedRowHeight } = getTimelineContext()
</script>

<div
    class="row"
    style="min-height: {$collapsedRowHeight}px; max-height: {$collapsedRowHeight}px;">
    {#if !row.children}
        <Text size="1.15rem">+</Text>
    {/if}
</div>

{#if row.children && row.expanded}
    {#each row.children as child}
        <svelte:self row={child} />
    {/each}
{/if}

<style>
    .row {
        border-top: 1px solid var(--color-border);

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
</style>
