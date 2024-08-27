/*
 * @Description: 
 * @Author: medicom.JiaXianMeng
 * @Date: 2024-08-26 17:16:32
 * @LastEditors: medicom.JiaXianMeng
 * @LastEditTime: 2024-08-27 11:05:35
 * @FilePath: \my-electron-app\preload.js
 */

// 写法一
// window.addEventListener('DOMContentLoaded', () => {
// 	const replaceText = (selector, text) => {
// 		const element = document.getElementById(selector)
// 		if (element) element.innerText = text
// 	}

// 	for (const dependency of ['chrome', 'node', 'electron']) {
// 		replaceText(`${dependency}-version`, process.versions[dependency])
// 	}
// })

// 写法二
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
	node: () => process.versions.node,
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
	ping: () => ipcRenderer.invoke('ping')
	// 除函数之外，我们也可以暴露变量

})