/*
 * @Description: 主进程
 * @Author: medicom.JiaXianMeng
 * @Date: 2024-08-26 16:52:51
 * @LastEditors: medicom.JiaXianMeng
 * @LastEditTime: 2024-08-28 14:53:47
 * @FilePath: \my-electron-app\main.js
 */
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const registerAppMenu = require('./menus');
const isMac = process.platform === 'darwin'

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	win.loadFile('index.html')
	// win.webContents.openDevTools()
	// win.loadURL('https://www.baidu.com')
}

app.whenReady().then(() => {
	ipcMain.handle('pingFun', () => 'pong')
	createWindow()
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (!isMac) app.quit()
})

try {
	require('electron-reloader')(module, {});
} catch (_) { }

registerAppMenu()



