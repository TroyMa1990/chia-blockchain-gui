const { exec } = require('child_process')
const { dialog, app } = require('electron')
const path = require('path')
 

// 启动服务
export default function openServer(pool,wallet) {
   const cwd =  path.resolve(app.getAppPath(), '/dort/')

  const appFolder = path.resolve(process.execPath);
//    const cwd =  path.resolve(app.getAppPath(), '../dort/')
    console.log("cwd",app.getAppPath())
    console.log("appFolder",process.execPath)
    console.log("appFolder dort",path.posix.resolve(app.getAppPath(),"dort"))
 
     exec(`dortpool.bat ${pool} ${wallet}`, { cwd }, (error, stdout, stderr) => {
       if (error) {
         console.error(`执行的错误: ${JSON.stringify(error)}`)
         dialog.showMessageBox({
           type: 'error',
           title: '启动服务失败,请重启软件试下',
           message: JSON.stringify(error),
           buttons: ['确认']
         })
       }
     })
}
