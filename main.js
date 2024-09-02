/*
 * @Description: 主进程
 * @Author: medicom.JiaXianMeng
 * @Date: 2024-08-26 16:52:51
 * @LastEditors: medicom.JiaXianMeng
 * @LastEditTime: 2024-09-02 13:39:33
 * @FilePath: \my-electron-app\main.js
 */
const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = require('electron')
const path = require('node:path')
const registerAppMenu = require('./menus');
const isMac = process.platform === 'darwin'
let tray = null
let WIN = null
let timer = null
let count = 0
let icon = nativeImage.createFromPath('./assets/icon/logo.png')
const createWindow = () => {
  WIN = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  WIN.loadFile('index.html')
  // WIN.webContents.openDevTools()
  // WIN.loadURL('https://www.baidu.com')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  ipcMain.handle('pingFun', () => 'pong')
  // 图标放入--系统托盘
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'electron微信',
      role: 'redo',
      click: () => {
        if (WIN) {
          WIN.show()
          tray.setImage(icon)
          tray.setToolTip('打开这个窗口')
          clearInterval(timer)
          timer = null
          count = 0
        }
      }
    },
    { label: '退出electron微信', role: 'quit' }
  ])
  tray.setToolTip('my electron')
  tray.setContextMenu(contextMenu)

  // 渲染线程通知，有新的消息
  ipcMain.on('haveMessage', (event, arg) => {
    timer = setInterval(() => {
      count += 1
      if (count % 2 === 0) {
        tray.setImage(icon)
      } else {
        tray.setImage(nativeImage.createEmpty()) // 创建一个空的nativeImage实例
      }
      tray.setToolTip(`您有${count}条新消息`)
    }, 500)
  })
  tray.on('click', () => {
    if (WIN.isVisible()) {
      WIN.show()
      tray.setImage(icon)
      tray.setToolTip('点击打开这个窗口')
      clearInterval(timer)
      timer = null
      count = 0
    } else {
      WIN.show()
    }
  })

})

app.on('window-all-closed', () => {
  if (!isMac) app.quit()
})

try {
  require('electron-reloader')(module, {});
} catch (_) { }

require('update-electron-app')()//版本远程更新

registerAppMenu()



