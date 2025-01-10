'use strict';

const path = require('path');
const ts = require('typescript');

function _interopNamespaceDefault(e) {
	const n = Object.create(null);
	if (e) {
		for (const k in e) {
			n[k] = e[k];
		}
	}
	n.default = e;
	return n;
}

const path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
const ts__namespace = /*#__PURE__*/_interopNamespaceDefault(ts);

function getTSConfigFile(tsconfigPath) {
  try {
    const basePath = path__namespace.dirname(tsconfigPath);
    const configFile = ts__namespace.readConfigFile(tsconfigPath, ts__namespace.sys.readFile);
    return ts__namespace.parseJsonConfigFileContent(
      configFile.config,
      ts__namespace.sys,
      basePath,
      {},
      tsconfigPath
    );
  } catch (error) {
    return {};
  }
}

exports.getTSConfigFile = getTSConfigFile;
