const { exec } = require('child_process')
const { dialog, ipcMain } = require('electron')
const path = require('path')
 

// 启动服务
export  function openServer(mainWindow,pool,wallet) {
  const cwd =  path.posix.resolve('dort')
 
  exec(`dortpool.bat ${pool} ${wallet}`, { cwd }, (error, stdout, stderr) => {
   if (error) {
    mainWindow.webContents.send('mine-change',"startfalse");
     console.error(`执行的错误: ${JSON.stringify(error)}`)
     dialog.showMessageBox({
       type: 'error',
       title:'开始挖矿',
       message: 'Dort矿池挖矿进程启动失败，请确保dort文件夹在项目根目录'+JSON.stringify(error),
       buttons: ['确认']
     })
   }else{
    mainWindow.webContents.send('mine-change',"starttrue");
     dialog.showMessageBox({
       type: 'info',
       title: '开始挖矿',
       message: 'Dort矿池挖矿进程已开启，请勿关闭dortpool挖矿程序',
       buttons: ['确认']
     })
   }
 })
}
export  function stopServer(mainWindow) {
  const cwd =  path.posix.resolve('dort')
  exec(`killdortpool.bat`, { cwd }, (error, stdout, stderr) => {
   if (error) {
    mainWindow.webContents.send('mine-change',"stopfalse");
     console.error(`执行的错误: ${JSON.stringify(error)}`)
     dialog.showMessageBox({
       type: 'error',
       title: '停止挖矿',
       message: 'Dort矿池挖矿停止进程失败，请确保dort文件夹在项目根目录'+JSON.stringify(error),
       buttons: ['确认']
     })
    
   }else{
    mainWindow.webContents.send('mine-change',"stoptrue");
     dialog.showMessageBox({
       type: 'info',
       title: '停止挖矿',
       message: 'Dort挖矿进程已停止',
       buttons: ['确认']
     })
   }
 })
}
