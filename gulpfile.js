require('dotenv').config()
const { src, dest, series, parallel } = require('gulp');
const del = require('del');
const fs   = require('fs');
const zip = require('gulp-zip');
const log = require('fancy-log');
var exec = require('child_process').exec;

const paths = {
  build: `./builds/${process.env.ENV}-build`,
  server_file_name: 'server.bundle.js',
  api_src: `./backend/**`,
  angular_app_source: './frontend',
  angular_dist_src: `./frontend/dist/**/*`,
  angular_dist_output: `./builds/${process.env.ENV}-build/dist`,
  zipped_file_name: 'Fgoons2020Hackathon.zip'
};

function clean()  {
  log('removing the old files in the directory')
  return del(`./builds/prod-build/**`, {force:true});
}

function createBuildFolder() {
  const dir = paths.build;
  log(`Creating the folder if not exist  ${dir}`)
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    log('📁  folder created:', dir);
  }

  return Promise.resolve('the value is ignored');
}

function buildAngularCodeTask(cb) {
  log('building Angular code into the directory')
  return exec(`cd ${paths.angular_app_source} && npm run build`, function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    cb(err);
  })
}

function copyAngularCodeTask() {
  log('copying Angular code into the directory')
  return src(`${paths.angular_dist_src}`)
        .pipe(dest(`${paths.angular_dist_output}`));
}

function copyNodeJSCodeTask() {
  log('building and copying server code into the directory')
  // return src(['package.json', 'server.js'])
  return src([paths.api_src, `!${paths.api_src}/{node_modules,node_modules/**}`])
        .pipe(dest(`${paths.build}`))
}

function zippingTask() {
  log('zipping the code ')
  return src(`${paths.build}/**`)
      .pipe(zip(`${paths.zipped_file_name}`))
      .pipe(dest(`${paths.build}`))
}

exports.default = series(
  clean,
  createBuildFolder,
  buildAngularCodeTask,
  parallel(copyAngularCodeTask, copyNodeJSCodeTask),
  zippingTask
);
