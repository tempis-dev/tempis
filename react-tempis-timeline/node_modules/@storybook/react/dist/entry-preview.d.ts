import { D as Decorator } from './public-types-8dd0ccdf.js';
import { ArgsStoryFn, RenderContext, BaseAnnotations } from 'storybook/internal/types';
import { R as ReactRenderer } from './types-a5624094.js';
import 'react';

declare const render: ArgsStoryFn<ReactRenderer>;

declare function renderToCanvas({ storyContext, unboundStoryFn, showMain, showException, forceRemount, }: RenderContext<ReactRenderer>, canvasElement: ReactRenderer['canvasElement']): Promise<() => void>;

declare const mount: BaseAnnotations<ReactRenderer>['mount'];

declare const parameters: {
    renderer: string;
};

declare const decorators: Decorator[];

export { decorators, mount, parameters, render, renderToCanvas };
