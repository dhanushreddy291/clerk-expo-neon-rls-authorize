module.exports = function (api) {
    api.cache(true)
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // ... other plugins
            [
                'transform-inline-environment-variables',
                {
                    include: 'TAMAGUI_TARGET',
                },
            ],
            [
                '@tamagui/babel-plugin',
                {
                    components: ['tamagui'],
                    config: './tamagui.config.ts',
                    logTimings: true,
                },
            ],
        ],
    }
} 