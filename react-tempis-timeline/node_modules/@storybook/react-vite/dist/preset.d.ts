import { PresetProperty } from 'storybook/internal/types';
import { StorybookConfig } from './index.js';
import '@storybook/builder-vite';
import '@joshwooding/vite-plugin-react-docgen-typescript';

declare const core: PresetProperty<'core'>;
declare const viteFinal: StorybookConfig['viteFinal'];

export { core, viteFinal };
