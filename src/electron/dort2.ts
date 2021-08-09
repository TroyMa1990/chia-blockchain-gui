const { exec } = require('child_process')
const { dialog, app } = require('electron')
const path = require('path')
 

// 启动服务
export default function openServer(pool,wallet) {

  const cwd =  path.posix.resolve('dort')
  const cwd2 = process.cwd()
  //  const cwd =  path.posix.resolve(app.getAppPath(),"../dort")
  //  const cwd =  path.resolve(app.getAppPath(), '/dort/')

  // const appFolder = path.resolve(process.execPath);
//    const cwd =  path.resolve(app.getAppPath(), '../dort/')
    // console.log("cwd",app.getAppPath())
    // console.log("appFolder",process.execPath)
    // console.log("appFolder dort",path.posix.resolve(app.getAppPath(),"src/dort"))
 
     exec(`dortpool.bat ${pool} ${wallet}`, { cwd2 }, (error, stdout, stderr) => {
       if (error) {
         console.error(`执行的错误: ${JSON.stringify(error)}`)
         dialog.showMessageBox({
           type: 'error',
           title: cwd,
           message: JSON.stringify(error),
           buttons: ['确认2']
         })
       }
     })

      
     exec(`dortpool.bat ${pool} ${wallet}`, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行的错误: ${JSON.stringify(error)}`)
        dialog.showMessageBox({
          type: 'error',
          title: cwd,
          message: JSON.stringify(error),
          buttons: ['确认1']
        })
      }
    })
}
