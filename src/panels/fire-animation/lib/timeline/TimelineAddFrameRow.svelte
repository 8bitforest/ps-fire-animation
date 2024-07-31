<script lang="ts">
    import { getRowHeightStyle, getTimelineContext, Row } from './Timeline'
    import Text from '../../../../lib/components/Text.svelte'

    export let row: Row

    let expanded = row.expanded

    let { collapsedRowHeight, expandedRowHeight, addFrameColWidth } =
        getTimelineContext()
</script>

<div
    class="row"
    style={getRowHeightStyle(
        row,
        $expanded,
        $collapsedRowHeight,
        $expandedRowHeight
    )}>
    <div class="buttons" style="min-width: {$addFrameColWidth}px">
        {#if !row.children}
            <Text size="1.15rem">+</Text>
        {/if}
    </div>
</div>

{#if row.children && $expanded}
    {#each row.children as child (child.id)}
        <svelte:self row={child} />
    {/each}
{/if}

<style>
    .row {
        border-bottom: 1px solid var(--color-border);

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }

    .buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
</style>
