import { StepLabel, PlayFunction, StoryContext } from 'storybook/internal/types';

declare const runStep: (label: StepLabel, play: PlayFunction, context: StoryContext) => void | Promise<void>;
declare const parameters: {
    throwPlayFunctionExceptions: boolean;
};

export { parameters, runStep };
