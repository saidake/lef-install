const fs = require("fs-extra");
const path =require("path")
const process=require("process")
function init(projectRootDir,projectName,hasYarn,templatePackageName,originalProcessDirectory){

    console.log('hasYarn: ', hasYarn);

    const currentFiles=fs.readdirSync(projectRootDir).filter((val)=>!/node_modules/.test(val))
    const templateDir=path.join(projectRootDir,'node_modules/@saidake',templatePackageName,"template");
    
    const templateFiles=fs.readdirSync(templateDir);

    //empty current dir except node_modules
    currentFiles.forEach((val)=>{
        fs.removeSync(path.join(projectRootDir,val))                 
    })

    // move template files
    templateFiles.forEach((val)=>{
        fs.moveSync(path.join(templateDir,val), path.join(projectRootDir,val), { overwrite: true })
    })

    const yarnLockPath=path.join(projectRootDir,'yarn.lock');
    const packageLockPath=path.join(projectRootDir,'package-lock.json');
    if(hasYarn&&fs.ensureFileSync(yarnLockPath)){
        fs.removeSync(yarnLockPath)
    }else if(fs.ensureFileSync(packageLockPath)){
        fs.removeSync(packageLockPath)
    }

    fs.removeSync(path.join(projectRootDir,"node_modules"))                 
    process.exit(1);
}


module.exports=init
