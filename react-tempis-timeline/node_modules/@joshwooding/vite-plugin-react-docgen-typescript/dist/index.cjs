'use strict';

const defaultPropFilter = (prop) => {
  return !prop.parent?.fileName.includes("node_modules");
};

const getDocgen = async (config) => {
  const docGen = await import('react-docgen-typescript');
  const {
    tsconfigPath,
    compilerOptions,
    propFilter = defaultPropFilter,
    setDisplayName,
    typePropName,
    ...rest
  } = config;
  const docgenOptions = {
    propFilter,
    ...rest
  };
  return docGen.withCompilerOptions(
    {},
    docgenOptions
  );
};
const startWatch = async (config, onProgramCreatedOrUpdated) => {
  const { default: ts } = await import('typescript');
  const { getTSConfigFile } = await import('./chunks/typescript.cjs');
  let compilerOptions = {
    jsx: ts.JsxEmit.React,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.Latest
  };
  const tsconfigPath = config.tsconfigPath ?? "./tsconfig.json";
  if (config.compilerOptions) {
    compilerOptions = {
      ...compilerOptions,
      ...config.compilerOptions
    };
  } else {
    const { options: tsOptions } = getTSConfigFile(tsconfigPath);
    compilerOptions = { ...compilerOptions, ...tsOptions };
  }
  const host = ts.createWatchCompilerHost(
    tsconfigPath,
    compilerOptions,
    ts.sys,
    ts.createSemanticDiagnosticsBuilderProgram,
    void 0,
    () => {
    }
  );
  host.afterProgramCreate = (program) => {
    onProgramCreatedOrUpdated(program.getProgram());
  };
  return new Promise((resolve) => {
    const watch = ts.createWatchProgram(host);
    resolve([watch.getProgram().getProgram(), watch.close]);
  });
};
function reactDocgenTypescript(config = {}) {
  let tsProgram;
  let docGenParser;
  let generateDocgenCodeBlock;
  let generateOptions;
  let filter;
  const moduleInvalidationQueue = /* @__PURE__ */ new Map();
  let closeWatch;
  return {
    name: "vite:react-docgen-typescript",
    async configResolved() {
      const { getGenerateOptions } = await import('./chunks/options.cjs');
      generateDocgenCodeBlock = (await import('./chunks/generate.cjs')).generateDocgenCodeBlock;
      const { createFilter } = await import('vite');
      docGenParser = await getDocgen(config);
      generateOptions = getGenerateOptions(config);
      [tsProgram, closeWatch] = await startWatch(config, (program) => {
        tsProgram = program;
        Array.from(moduleInvalidationQueue.entries()).forEach(
          ([filepath, invalidateModule]) => {
            invalidateModule();
            moduleInvalidationQueue.delete(filepath);
          }
        );
      });
      filter = createFilter(
        config.include ?? ["**/**.tsx"],
        config.exclude ?? ["**/**.stories.tsx"]
      );
    },
    async transform(src, id) {
      if (!filter(id)) {
        return;
      }
      try {
        const componentDocs = docGenParser.parseWithProgramProvider(
          id,
          () => tsProgram
        );
        if (!componentDocs.length) {
          return null;
        }
        return generateDocgenCodeBlock({
          filename: id,
          source: src,
          componentDocs,
          ...generateOptions
        });
      } catch (e) {
        return src;
      }
    },
    async handleHotUpdate({ file, server, modules }) {
      if (!filter(file))
        return;
      const module = modules.find((mod) => mod.file === file);
      if (!module)
        return;
      moduleInvalidationQueue.set(file, () => {
        server.moduleGraph.invalidateModule(
          module,
          void 0,
          Date.now(),
          true
        );
      });
    },
    closeBundle() {
      closeWatch();
    }
  };
}

module.exports = reactDocgenTypescript;
