<script lang="ts">
    import FireAnimation from './panels/fire-animation/FireAnimation.svelte'

    require('photoshop').action.addNotificationListener(
        ['all'],
        (event, descriptor) => {
            console.log(
                'Event:' + event + ' Descriptor: ' + JSON.stringify(descriptor)
            )
        }
    )
</script>

<main>
    <sp-heading>Fire Animation</sp-heading>
    <FireAnimation />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
</style>
