import { UXP_Manifest, UXP_Config } from 'vite-uxp-plugin'
import { version } from './package.json'

const extraPrefs = {
    hotReloadPort: 8080,
    copyZipAssets: ['public-zip/*']
}

const manifest: UXP_Manifest = {
    id: 'com.eightbitforest.fireanimation',
    name: 'Fire Animation',
    version,
    main: 'index.html',
    manifestVersion: 6,
    host: [
        {
            app: 'PS',
            minVersion: '24.2.0'
        }
    ],
    entrypoints: [
        {
            type: 'panel',
            id: 'com.eightbitforest.fireanimation.panel',
            label: {
                default: 'Fire Animation'
            },
            minimumSize: { width: 230, height: 200 },
            maximumSize: { width: 2000, height: 2000 },
            preferredDockedSize: { width: 230, height: 300 },
            preferredFloatingSize: { width: 450, height: 400 },
            icons: [
                {
                    width: 23,
                    height: 23,
                    path: 'icons/dark.png',
                    scale: [1, 2],
                    theme: ['darkest', 'dark', 'medium']
                },
                {
                    width: 23,
                    height: 23,
                    path: 'icons/light.png',
                    scale: [1, 2],
                    theme: ['lightest', 'light']
                }
            ]
        }
    ],
    requiredPermissions: {
        localFileSystem: 'fullAccess',
        launchProcess: {
            schemes: ['https', 'slack', 'file', 'ws'],
            extensions: ['.xd', '.psd', '.bat', '.cmd']
        },
        network: {
            domains: [
                'https://picsum.photos',
                `ws://localhost:${extraPrefs.hotReloadPort}` // Required for hot reload
            ]
        },
        clipboard: 'readAndWrite',
        webview: {
            allow: 'yes',
            domains: []
        },
        ipc: {
            enablePluginCommunication: true
        },
        allowCodeGenerationFromStrings: true
    },
    icons: [
        {
            width: 48,
            height: 48,
            path: 'icons/plugin-icon.png',
            scale: [1, 2],
            theme: ['darkest', 'dark', 'medium', 'lightest', 'light', 'all'],
            species: ['pluginList']
        }
    ]
}

export const config: UXP_Config = {
    manifest,
    ...extraPrefs
}
