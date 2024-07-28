<!-- Icon Button! -->

<script lang="ts">
    export let disabled = false
    export let click = () => {}
    export let tooltip = ''

    let className = ''
    export { className as class }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="icon-button {className}"
    class:disabled
    on:click={click}
    title={tooltip}>
    <slot></slot>
</div>

<style>
    .icon-button {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.1s;
        border: 1px solid transparent;
    }

    .icon-button.disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    :global(.icon-button.disabled svg) {
        fill: #666;
    }

    .icon-button:hover:not(.disabled) {
        background-color: var(--color-button-hover);
        border: 1px solid var(--color-surface-1);
    }

    .icon-button:active {
        background-color: var(--color-button-active);
        border: 1px solid var(--color-surface-1);
    }
</style>
