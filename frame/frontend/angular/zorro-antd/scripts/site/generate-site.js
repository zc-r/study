const fs = require('fs-extra');
const path = require('path');
const parseDocMdUtil = require('./utils/parse-doc-md');
const parseDemoMdUtil = require('./utils/parse-demo-md');
const nameWithoutSuffixUtil = require('./utils/name-without-suffix');
const generateCodeBox = require('./utils/generate-code-box');
const generateDemo = require('./utils/generate-demo');
const generateDemoCodeFiles = require('./utils/generate-demo-code-files');
const generateDocs = require('./utils/generate-docs');
const generateRoutes = require('./utils/generate-routes');
const capitalizeFirstLetter = require('./utils/capitalize-first-letter');
const camelCase = require('./utils/camelcase');
const getMeta = require('./utils/get-meta');
const arg = process.argv[2];
// create site folder
const showCasePath = path.resolve(__dirname, '../../site');

function generate(target) {
  const isSyncSpecific = target && (target !== 'init');
  if (!target) {
    fs.removeSync(`${showCasePath}/doc`);
    fs.copySync(path.resolve(__dirname, '_site/doc'), `${showCasePath}/doc`);
  } else if (target === 'init') {
    fs.removeSync(`${showCasePath}`);
    fs.copySync(path.resolve(__dirname, '_site'), `${showCasePath}`);
  } else {
    fs.removeSync(`${showCasePath}/doc/app/${target}`);
  }
  const showCaseTargetPath = `${showCasePath}/doc/app/`;
  // read components folder
  const rootPath = path.resolve(__dirname, '../../components');
  const rootDir = fs.readdirSync(rootPath);
  const componentsDocMap = {};
  const componentsMap = {};
  rootDir.forEach(componentName => {
    if (isSyncSpecific) {
      if (componentName !== target) {
        return;
      }
    }
    const componentDirPath = path.join(rootPath, componentName);
    if (componentName === 'style' || componentName === 'core' || componentName === 'locale' || componentName === 'i18n' || componentName === 'version') {
      return;
    }
    if (fs.statSync(componentDirPath).isDirectory()) {
      // create site/doc/app->${component} folder
      const showCaseComponentPath = path.join(showCaseTargetPath, componentName);
      // TODO: 自己添加的过滤 ↓
      if (/* !componentDirPath.endsWith('button') && */ !componentDirPath.endsWith('table')) {
        return;
      }
      // TODO: 自己添加的过滤 ↑
      componentsDocMap[componentName] = {};
      fs.mkdirSync(showCaseComponentPath);
      // handle components->${component}->demo folder
      const demoDirPath = path.join(componentDirPath, 'demo');
      const demoMap = {};
      if (fs.existsSync(demoDirPath)) {
        const demoDir = fs.readdirSync(demoDirPath);
        demoDir.forEach(demo => {

          if (/.md$/.test(demo)) {
            const nameKey = nameWithoutSuffixUtil(demo);
            const demoMarkDownFile = fs.readFileSync(path.join(demoDirPath, demo));
            demoMap[nameKey] = parseDemoMdUtil(demoMarkDownFile);
            componentsDocMap[componentName].i18n = Object.keys(demoMap[nameKey].meta.title);
            demoMap[nameKey].name = `NzDemo${camelCase(capitalizeFirstLetter(componentName))}${camelCase(capitalizeFirstLetter(nameKey))}Component`;
            demoMap[nameKey].zhCode = generateCodeBox(componentName, demoMap[nameKey].name, nameKey, demoMap[nameKey].meta.title['zh-CN'], demoMap[nameKey].zh, demoMap[nameKey].meta.iframe);
          }
          if (/.ts$/.test(demo)) {
            const nameKey = nameWithoutSuffixUtil(demo);
            demoMap[nameKey].ts = String(fs.readFileSync(path.join(demoDirPath, demo)));
            // copy ts file to site->${component} folder
            fs.writeFileSync(path.join(showCaseComponentPath, demo), demoMap[nameKey].ts);
          }
          if (demo === 'module') {
            const data = String(fs.readFileSync(path.join(demoDirPath, demo)));
            fs.writeFileSync(path.join(showCaseComponentPath, 'module.ts'), data);
          }
        });
      }

      const result = {
        name: componentName,
        docZh: parseDocMdUtil(fs.readFileSync(path.join(componentDirPath, 'doc/index.zh-CN.md')), `components/${componentName}/doc/index.zh-CN.md`),
        docs: {},
        demoMap,
        i18n: componentsDocMap[componentName].i18n
      };

      result.i18n.forEach(i18n => result.docs[i18n] = parseDocMdUtil(fs.readFileSync(path.join(componentDirPath, `doc/index.${i18n}.md`)), `components/${componentName}/doc/index.${i18n}.md`));

      componentsDocMap[componentName].zh = result.docs['zh-CN'].meta;
      componentsMap[componentName] = demoMap;
      generateDemo(showCaseComponentPath, result);
      generateDemoCodeFiles(result, showCasePath);
    }
  });

  if (!isSyncSpecific) {
    // read docs folder
    const docsPath = path.resolve(__dirname, '../../docs');
    const docsDir = fs.readdirSync(docsPath);
    let docsMap = {};
    let docsMeta = {};
    docsDir.forEach(doc => {
      const name = nameWithoutSuffixUtil(doc);
      docsMap[name] = {
        zh: fs.readFileSync(path.join(docsPath, `${name}.zh-CN.md`))
      };
      docsMeta[name] = {
        zh: getMeta(docsMap[name].zh)
      };
    });
    generateDocs(showCaseTargetPath, docsMap);
    generateRoutes(showCaseTargetPath, componentsDocMap, docsMeta);
  }
}

if (require.main === module) {
  generate(arg);
}

module.exports = generate;