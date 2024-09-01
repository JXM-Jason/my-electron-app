/*
 * @Description: 主进程
 * @Author: medicom.JiaXianMeng
 * @Date: 2024-08-26 16:52:51
 * @LastEditors: medicom.JiaXianMeng
 * @LastEditTime: 2024-09-02 00:48:30
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
  ipcMain.handle('pingFun', () => 'pong')
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  // 图标放入--系统托盘
  tray = new Tray(nativeImage.createFromPath('./assets/icon.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '微信',
      role: 'redo',
      click: () => {
        if (WIN) {
          WIN.show()
        }
      }
    },
    { label: '退出微信', role: 'quit' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
  tray.on('click', (event, bounds, position) => {  // 监听单击做的时
    console.log(event, bounds, position)
    if (WIN.isVisible()) {
      WIN.hide()
    } else {
      WIN.show()
    }
  })

  // 渲染线程通知，有新的消息
  ipcMain.on('haveMessage', (event, arg) => {
    timer = setInterval(() => {
      count += 1
      // if (count % 2 === 0) {
      //   tray.setImage(icon)
      // } else {
      //   tray.setImage(nativeImage.createEmpty()) // 创建一个空的nativeImage实例
      // }
      tray.setImage(nativeImage.createEmpty())
      tray.setToolTip('您有一条新消息')
    }, 500)
  })
  tray.on('click', () => {
    if (WIN.isVisible()) {
      WIN.hide()
    } else {
      WIN.show()
      // tray.setImage(icon)
      tray.setToolTip('私塾国际学府')
      clearInterval(timer)
      timer = null
      count = 0
    }
  })


})

app.on('window-all-closed', () => {
  if (!isMac) app.quit()
})

try {
  require('electron-reloader')(module, {});
} catch (_) { }

registerAppMenu()



