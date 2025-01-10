'use strict';

var path = require('path');
var common = require('storybook/internal/common');

var checkActionsLoaded=configDir=>{common.checkAddonOrder({before:{name:"@storybook/addon-actions",inEssentials:!0},after:{name:"@storybook/addon-interactions",inEssentials:!1},configFile:path.isAbsolute(configDir)?path.join(configDir,"main"):path.join(process.cwd(),configDir,"main"),getConfig:configFile=>common.serverRequire(configFile)});},ADDON_INTERACTIONS_IN_USE=!0;

exports.ADDON_INTERACTIONS_IN_USE = ADDON_INTERACTIONS_IN_USE;
exports.checkActionsLoaded = checkActionsLoaded;
