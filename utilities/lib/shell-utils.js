// spawn a child process and execute shell command
// borrowed from https://github.com/mout/mout/ build script
// author Miller Medeiros
// released under MIT License
// version: 0.1.0 (2013/02/01)

// execute a single shell command where "cmd" is a string
exports.exec = function(cmd, cb) {
  // this would be way easier on a shell/bash script :P
  const child_process = require('child_process');
  const parts = cmd.split(/\s+/g);
  const p = child_process.spawn(parts[0], parts.slice(1), { stdio: 'inherit' });
  p.on('exit', function(code) {
    let err = null;
    if (code) {
      err = new Error('command "' + cmd + '" exited with wrong status code "' + code + '"');
      err.code = code;
      err.cmd = cmd;
    }
    if (cb) cb(err);
  });
};

// execute multiple commands in series
// this could be replaced by any flow control lib
exports.series = function(cmds, cb) {
  const execNext = function() {
    exports.exec(cmds.shift(), function(err) {
      if (err) {
        cb(err);
      } else {
        if (cmds.length) execNext();
        else cb(null);
      }
    });
  };
  execNext();
};
