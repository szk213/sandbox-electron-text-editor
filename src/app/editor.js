require('ace-builds/src-min-noconflict/ace');
require('ace-builds/src-min-noconflict/mode-javascript');
require('ace-builds/src-min-noconflict/theme-twilight')
//require('ace-builds/src-min-noconflict/worker-javascript')

const { BrowserWindow, dialog } = require('electron').remote;
const fs = require('fs');

/**
 * 読み込みするためのファイルを開く
 */
function openLoadFile() {
    const win = BrowserWindow.getFocusedWindow();

    dialog.showOpenDialog(
        win,
        // どんなダイアログを出すかを指定するプロパティ
        {
            properties: ['openFile'],
            filters: [
                {
                    name: 'Documents',
                    extensions: ['txt', 'text', 'html', 'js']
                }
            ]
        },
        // [ファイル選択]ダイアログが閉じられた後のコールバック関数
        function (filenames) {
            if (filenames) {
                readFile(filenames[0]);
            }
        });
}

/**
 * テキストを読み込み、テキストを入力エリアに設定する
 */
function readFile(path) {
    currentPath = path;
    fs.readFile(path, function (error, text) {
        if (error != null) {
            alert('error : ' + error);
            return;
        }
        // フッター部分に読み込み先のパスを設定する
        footerArea.innerHTML = path;
        // テキスト入力エリアに設定する
        editor.setValue(text.toString(), -1);
    });
}

/**
 * ファイルを保存する
 */
function saveFile() {

    //　初期の入力エリアに設定されたテキストを保存しようとしたときは新規ファイルを作成する
    if (currentPath == "") {
        saveNewFile();
        return;
    }

    const win = BrowserWindow.getFocusedWindow();

    dialog.showMessageBox(win, {
        title: 'ファイルの上書き保存を行います。',
        type: 'info',
        buttons: ['OK', 'Cancel'],
        detail: '本当に保存しますか？'
    },
        // メッセージボックスが閉じられた後のコールバック関数
        function (respnse) {
            // OKボタン(ボタン配列の0番目がOK)
            if (respnse == 0) {
                var data = editor.getValue();
                writeFile(currentPath, data);
            }
        }
    );
}

/**
 * ファイルを書き込む
 */
function writeFile(path, data) {
    fs.writeFile(path, data, function (error) {
        if (error != null) {
            alert('error : ' + error);
            return;
        }
    });
}


var editor;
window.addEventListener('DOMContentLoaded', function () {
    ace.config.set("workerPath", "../node_modules/ace-builds/src-min-noconflict");
    editor = ace.edit("editor");
    editor.getSession().setMode('ace/mode/javascript');
    editor.setTheme("ace/theme/twilight");

    editor.$blockScrolling = Infinity; // ワーニングに対処
    if (process.platform == 'darwin') { // Ctrl+Pが効かない問題に対処
        editor.commands.bindKey("Ctrl-P", "golineup");
    }
    document.body.addEventListener('dragover', function (e) {
        e.preventDefault();
    });
    document.body.addEventListener('drop', function (e) {
        e.preventDefault();
        if (e.dataTransfer.files[0]) {
            var file = e.dataTransfer.files[0].path;
            if (/\.js$/.test(file)) {
                openFile(file);
            }
        }
    });
});

function openFile(file) {
    require('fs').readFile(file, 'utf8', function (err, data) {
        editor.setValue(data, -1);
    });
}