import { Channel } from 'storybook/internal/channels';
import { Options } from 'storybook/internal/types';

declare const experimental_serverChannel: (channel: Channel, options: Options) => Promise<Channel>;

export { experimental_serverChannel };
