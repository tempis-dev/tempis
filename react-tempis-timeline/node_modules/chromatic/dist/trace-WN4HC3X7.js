'use strict';

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="bfeefdc1-1601-57f3-8310-e3161b70423d")}catch(e){}}();

var chunkIMZAONBG_js = require('./chunk-IMZAONBG.js');
var chunkX7RBQNLE_js = require('./chunk-X7RBQNLE.js');
var chunkLZXDNZPW_js = require('./chunk-LZXDNZPW.js');
var chunkTKGT252T_js = require('./chunk-TKGT252T.js');

var l=chunkTKGT252T_js.e(chunkX7RBQNLE_js.B());var{STORYBOOK_BASE_DIR:g,STORYBOOK_CONFIG_DIR:u,WEBPACK_STATS_FILE:b}=process.env;async function w(c){let{flags:t,input:f}=(0, l.default)(`
    Usage
      $ chromatic trace [-b|--base-dir] [-c|--config-dir] [-s|--stats-file] [-u|--untraced] [-m|--mode] [<changed files>...]

    Options
      <changed files>...                    List of changed files relative to repository root.
      --stats-file, -s <filepath>           Path to preview-stats.json. Alternatively, set WEBPACK_STATS_FILE. (default: 'storybook-static/preview-stats.json')
      --storybook-base-dir, -b <dirname>    Relative path from repository root to Storybook project root. Alternatively, set STORYBOOK_BASE_DIR. Use when your Storybook is located in a subdirectory of your repository.
      --storybook-config-dir, -c <dirname>  Directory where to load Storybook configurations from. Alternatively, set STORYBOOK_CONFIG_DIR. (default: '.storybook')
      --untraced, -u <filepath>             Disregard these files and their dependencies. Globs are supported via picomatch. This flag can be specified multiple times.
      --mode, -m <mode>                     Set to 'expanded' to reveal the underlying list of files for each bundle, or set to 'compact' to only show a flat list of affected story files.
    `,{argv:c,description:"Trace utility for TurboSnap",flags:{statsFile:{type:"string",alias:"s",default:b||"storybook-static/preview-stats.json"},storybookBaseDir:{type:"string",alias:"b",default:g||"."},storybookConfigDir:{type:"string",alias:"c",default:u||".storybook"},untraced:{type:"string",alias:"u",isMultiple:!0},mode:{type:"string",alias:"m"}}}),d={log:console,options:{storybookBaseDir:t.storybookBaseDir,storybookConfigDir:t.storybookConfigDir,untraced:t.untraced,traceChanged:t.mode||!0},git:{rootPath:await chunkIMZAONBG_js.v()}},p=await chunkLZXDNZPW_js.a(t.statsFile),e=f.map(o=>o.replace(/^\.\//,"")),i=e.find(o=>chunkIMZAONBG_js.L(o));if(i)throw new Error(`Unable to trace package manifest file (${i}) as that would require diffing file contents.`);await chunkIMZAONBG_js.Q(d,p,t.statsFile,e);}

exports.main = w;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=trace-WN4HC3X7.js.map
//# debugId=bfeefdc1-1601-57f3-8310-e3161b70423d
