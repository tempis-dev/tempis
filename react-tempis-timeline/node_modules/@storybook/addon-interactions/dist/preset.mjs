import ESM_COMPAT_Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join } from 'node:path';
import { checkAddonOrder, serverRequire } from 'storybook/internal/common';

const __filename = fileURLToPath(import.meta.url);
dirname(__filename);
ESM_COMPAT_Module.createRequire(import.meta.url);
var checkActionsLoaded=configDir=>{checkAddonOrder({before:{name:"@storybook/addon-actions",inEssentials:!0},after:{name:"@storybook/addon-interactions",inEssentials:!1},configFile:isAbsolute(configDir)?join(configDir,"main"):join(process.cwd(),configDir,"main"),getConfig:configFile=>serverRequire(configFile)});},ADDON_INTERACTIONS_IN_USE=!0;

export { ADDON_INTERACTIONS_IN_USE, checkActionsLoaded };
