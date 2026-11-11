
const { app, BrowserWindow, session } = require('electron');
const path = require('path');

const PARTITION = 'persist:whatsapp';

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 820,
        minWidth: 900,
        minHeight: 600,
        title: 'WhatsDesktop',
        icon: path.join(__dirname, 'whatsapp.ico'),
        backgroundColor: '#111b21',
        autoHideMenuBar: true,
        webPreferences: {
            partition: PARTITION,
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true
        }
    });

    const ses = session.fromPartition(PARTITION);

    ses.setPermissionRequestHandler((webContents, permission, callback) => {
        const allowed = [
            'notifications',
            'media',
            'mediaKeySystem'
        ];

        callback(allowed.includes(permission));
    });

    const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';

    win.webContents.setUserAgent(chromeUA);
    win.loadURL('https://web.whatsapp.com');

    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https://web.whatsapp.com/')) {
            win.loadURL(url);
        }
        return { action: 'deny' };
    });
}

app.whenReady().then(() => {
    app.setAppUserModelId('br.hub.whatsdesktop');
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
