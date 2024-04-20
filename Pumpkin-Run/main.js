const {app, BrowserWindow, Menu} = require('electron')

Menu.setApplicationMenu(null)

function createWindow (){

    const win = new BrowserWindow ({
        width: 1080,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')
    win.setIcon('img/assets/icon_html.png')
}

app.whenReady().then (() => {
    createWindow()

    app.on('activate', ()=> {
        if (BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
    })
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        app.quit()
    }
})


