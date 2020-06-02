const path = require('path')
const fs = require('fs')
const ora = require('ora')
var wget = require('download');

/**
 * Download GitHub `repo` to `dest` and callback `fn(err)`.
 *
 * @param {String} repo
 * @param {String} dest
 * @param {Function} fn
 */

function download(repo, dest, fn){
  var url = github(normalize(repo));
  wget(url, dest, { extract: true, strip: 1 }).then(function () {
    fn();
  }).catch(function(err) {
    fn(err);
  });
}

/**
 * Return a GitHub url for a given `repo` object.
 *
 * @param {Object} repo
 * @return {String}
 */

function github(repo){

  return 'https://codeload.github.com/'
    + repo.owner.split(':')[1]
    + '/'
    + repo.name.split('.git')[0]
    + '/zip/'
    + repo.branch
}

/**
 * Normalize a repo string.
 *
 * @param {String} string
 * @return {Object}
 */

function normalize(string){
  var owner = string.split('/')[0];
  var name = string.split('/')[1];
  var branch = 'master';

  if (~name.indexOf('#')) {
    branch = name.split('#')[1];
    name = name.split('#')[0];
  }

  return {
    owner: owner,
    name: name,
    branch: branch
  };
}

module.exports = function (target) {
  target = path.join(target || '', 'ths-native-plugin')
  return new Promise((resolve, reject) => {
    const url = `git@github.com:qtpalmtop/templates-ionic-native.git#master`
    const spinner = ora(`正在下载项目模板，源地址：${url}`).start();

    console.log()
    // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
    download(url,
      target, (err) => {
        if (err) {
          console.log('download err:', err)
          spinner.fail()
          reject(err)
        } else {
          console.log('download success:', target)
          spinner.succeed()
          // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
          resolve(target)
        }
      })
  })
}
