<script lang="ts">
    import Text from '../../../../lib/components/Text.svelte'
    import IconVisibility from '../../../../lib/components/icons/IconVisibility.svelte'
    import { getRowHeightStyle, getTimelineContext, Row } from './Timeline'
    import RowExpander from '../RowExpander.svelte'

    export let row: Row
    export let depth = 0

    let expanded = row.expanded

    const indentWidth = 30

    let { collapsedRowHeight, expandedRowHeight } = getTimelineContext()
</script>

<div
    class="row"
    style={getRowHeightStyle(
        row,
        $expanded,
        $collapsedRowHeight,
        $expandedRowHeight
    )}>
    <div class="row-contents" style="height: {$collapsedRowHeight}">
        <div class="layer-name" style="margin-left: {depth * indentWidth}px">
            {#if row.children}
                <RowExpander
                    expanded={$expanded}
                    onChanged={value => ($expanded = value)}
                    folder={true} />
            {:else}
                <div style="width: 22px" />
            {/if}
            <Text>{row.name}</Text>
        </div>
        <div class="right-icons">
            {#if !row.children}
                <RowExpander
                    expanded={$expanded}
                    onChanged={value => ($expanded = value)} />
            {/if}
            <IconVisibility class="icon-visibility" />
        </div>
    </div>

    {#if !row.children && $expanded}
        <div class="layer-info"></div>
    {/if}
</div>

{#if row.children && $expanded}
    {#each row.children as child}
        <svelte:self row={child} depth={depth + 1} />
    {/each}
{/if}

<style>
    .row {
        border-bottom: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .row-contents {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: space-between;
        padding-left: 5px;
        width: 100%;
        height: 20px;
    }

    .layer-info {
        /*position: relative;*/
        /*top: -1px;*/
        flex: 1 1 auto;
        width: 100%;
        border-top: 1px solid var(--color-border);
        background-color: var(--color-surface-2);
    }

    .layer-name {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .right-icons {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    :global(.icon-visibility) {
        margin-left: auto;
        margin-right: 5px;
        height: 70%;
    }
</style>
