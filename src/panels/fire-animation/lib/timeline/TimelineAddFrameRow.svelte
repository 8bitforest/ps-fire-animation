<script lang="ts">
    import { getRowHeightStyle, getTimelineContext, Row } from './Timeline'
    import IconDuplicate from '../../../../lib/components/icons/IconDuplicate.svelte'
    import IconAdd from '../../../../lib/components/icons/IconAdd.svelte'

    export let row: Row

    let expanded = row.expanded

    let {
        collapsedRowHeight,
        expandedRowHeight,
        addFrameColWidth,
        createEmptyFrame,
        createDuplicateFrame
    } = getTimelineContext()

    function onNewFrame() {
        const index = row.frames!.length - 1
        createEmptyFrame(row, index)
    }

    function onDuplicateFrame() {
        const lastFrame = row.frames![row.frames!.length - 1]
        createDuplicateFrame(lastFrame)
    }
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
        {#if row.frames}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="add-button" on:click={onNewFrame}>
                <IconAdd class="add-frame-row-button" />
            </div>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="add-button" on:click={onDuplicateFrame}>
                <IconDuplicate class="add-frame-row-button" />
            </div>
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
        justify-content: flex-start;
        padding-left: 2px;
    }

    .add-button:hover {
        fill: var(--color-button-hover);
    }

    :global(.add-frame-row-button) {
        height: 12px;
    }

    :global(.add-frame-row-button:hover) {
        fill: var(--icon-hover-fill);
    }
</style>
