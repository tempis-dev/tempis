import type { StorybookConfig } from '@storybook/vue3-vite';

import { join, dirname, resolve } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
    stories: [
        "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],
    addons: [
        getAbsolutePath('@storybook/addon-essentials'),
    ],
    framework: {
        name: getAbsolutePath('@storybook/vue3-vite'),
        options: {}
    },
    viteFinal: async (config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...config.resolve.alias,
            "@tempis/timeline": resolve(__dirname, "../../tempis-timeline/src/index.ts"),
        };
        return config;
    },
};

export default config;
