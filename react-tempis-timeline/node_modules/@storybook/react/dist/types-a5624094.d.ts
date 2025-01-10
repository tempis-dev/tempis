import { ComponentType } from 'react';
import { WebRenderer, Canvas } from 'storybook/internal/types';

interface ReactRenderer extends WebRenderer {
    component: ComponentType<this['T']>;
    storyResult: StoryFnReactReturnType;
    mount: (ui?: JSX.Element) => Promise<Canvas>;
}
type StoryFnReactReturnType = JSX.Element;

export { ReactRenderer as R };
