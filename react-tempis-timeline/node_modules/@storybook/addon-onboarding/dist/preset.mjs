import ESM_COMPAT_Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { telemetry } from 'storybook/internal/telemetry';

const __filename = fileURLToPath(import.meta.url);
dirname(__filename);
const require = ESM_COMPAT_Module.createRequire(import.meta.url);
var __require=(x=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(x,{get:(a,b)=>(typeof require<"u"?require:a)[b]}):x)(function(x){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+x+'" is not supported')});var STORYBOOK_ADDON_ONBOARDING_CHANNEL="STORYBOOK_ADDON_ONBOARDING_CHANNEL";var experimental_serverChannel=async(channel,options)=>{let{disableTelemetry}=await options.presets.apply("core",{});if(!disableTelemetry){let packageJsonPath=__require.resolve("@storybook/addon-onboarding/package.json"),{version:addonVersion}=JSON.parse(readFileSync(packageJsonPath,{encoding:"utf-8"}));channel.on(STORYBOOK_ADDON_ONBOARDING_CHANNEL,({type,...event})=>{type==="telemetry"&&telemetry("addon-onboarding",{...event,addonVersion});});}return channel};

export { experimental_serverChannel };
