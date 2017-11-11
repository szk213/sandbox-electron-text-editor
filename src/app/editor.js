require('ace-builds/src-min-noconflict/ace');
require('ace-builds/src-min-noconflict/mode-javascript');
require('ace-builds/src-min-noconflict/theme-twilight')
//require('ace-builds/src-min-noconflict/worker-javascript')
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