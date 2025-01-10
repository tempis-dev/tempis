import * as builtinHandlers from './handlers/index.js';
import parse from './parse.js';
import * as builtinResolvers from './resolver/index.js';
import { fsImporter, ignoreImporter, makeFsImporter, } from './importer/index.js';
import * as utils from './utils/index.js';
import { createConfig, defaultHandlers } from './config.js';
import { ERROR_CODES } from './error.js';
const builtinImporters = {
    fsImporter,
    ignoreImporter,
};
/**
 * Parse the *src* and scan for react components based on the config
 * that gets supplied.
 *
 * The default resolvers look for *exported* react components.
 *
 * By default all handlers are applied, so that all possible
 * different use cases are covered.
 *
 * The default importer is the fs-importer that tries to resolve
 * files based on the nodejs resolve algorithm.
 */
function defaultParse(src, config = {}) {
    const defaultConfig = createConfig(config);
    return parse(String(src), defaultConfig);
}
export { builtinHandlers, builtinResolvers, builtinImporters, defaultHandlers, makeFsImporter, defaultParse as parse, utils, ERROR_CODES, };
