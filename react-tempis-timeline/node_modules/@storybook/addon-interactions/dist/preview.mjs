import { instrument } from '@storybook/instrumenter';
import '@storybook/test';

var {step:runStep}=instrument({step:(label,play,context)=>play(context)},{intercept:!0}),parameters={throwPlayFunctionExceptions:!1};

export { parameters, runStep };
