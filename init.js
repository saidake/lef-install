const fs = require('fs-extra');
const path = require('path');
const process = require('process');
const spawn = require('cross-spawn');
const os = require("os");

function init(
  projectRootDir,           //创建的项目绝对路径
  projectName,              //项目名称
  hasYarn,                  //本地环境是否有yarn
  templatePackageName,      //下载的模板名称
  originalProcessDirectory  //执行 创建命令的 原始路径     D:\Desktop   
  
) {

  //读取 项目路径下排除node_modules的文件
  const currentFiles = fs
    .readdirSync(projectRootDir)
    .filter((val) => !/node_modules/.test(val));
  
  //下载的模板包路径
  const templateDir = path.join(
    projectRootDir,
    'node_modules',
    templatePackageName,
  );

  //读取 模板包的所有文件
  const templateFiles = fs.readdirSync(templateDir);

  
  //移动模板包的所有文件到 项目路径
  templateFiles.forEach((val) => {
    fs.moveSync(path.join(templateDir, val), path.join(projectRootDir, val), {
      overwrite: true
    });
  });



  const packageJsonFile=fs.readFileSync(path.join(projectRootDir, 'package.json'), "utf8")
  

  // ===========================================去掉项目模板的lock文件
  const yarnLockPath = path.join(projectRootDir, 'yarn.lock');
  const packageLockPath = path.join(projectRootDir, 'package-lock.json');
  const lockJsonFile;

  if (hasYarn) {
    fs.removeSync(packageLockPath);
  } else{
    fs.removeSync(yarnLockPath);
    lockJsonFile=fs.readFileSync(path.join(projectRootDir, 'package-lock.json'), "utf8")
  }


  // ===========================================json文件处理
  const packageJson = JSON.parse(packageJsonFile);
  if(lockJsonFile){
  const lockJson = JSON.parse(lockJsonFile);
  lockJson.name=projectName,
  lockJson.version="0.1.0"
  handleCheckPkgKeys(lockJson,["keywords","description","repository","homepage","bugs"])
  fs.writeFileSync(
    path.join(projectRootDir, 'package-lock.json'),
    JSON.stringify(lockJson, null, 2) + os.EOL
  );
}
  packageJson.name=projectName,
  packageJson.version="0.1.0"
  handleCheckPkgKeys(packageJson,["keywords","description","repository","homepage","bugs"])

  fs.writeFileSync(
    path.join(projectRootDir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  fs.removeSync(path.join(projectRootDir, 'node_modules'));
  let child;
  if(hasYarn){
      process.chdir(projectRootDir);
    child=spawn("yarn", ['install',"--cwd",projectRootDir,"--ignore-engines"], { stdio: "inherit" });
  }else{
    child=spawn("npm", ['install'], { stdio: "inherit" });
  }
  child.on("close", (code) => {
    if (code !== 0) {
      return;
    }
        return;
  });
}


function handleCheckPkgKeys(obj,keys){
  keys.forEach((val,ind)=>{
    if(obj[val]){
      delete obj[val]
    }
  })
}

module.exports = init;
