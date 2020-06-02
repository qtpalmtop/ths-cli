#!/usr/bin/env node

const program = require('commander')
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
// 这个模块可以获取node包的最新版本
const latestVersion = require('latest-version')  // npm i latest-version -D
const glob = require('glob') // npm i glob -D
const download = require('../lib/download')
const generator = require('../lib/generator')
const list = glob.sync('*')  // 遍历当前目录

program.usage('<project-name>').parse(process.argv)

// 根据输入，获取项目名称
let projectName = program.args[0]
let rootName = path.basename(process.cwd())

if (!projectName) {  // project-name 必填
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  program.help()
  return
}

if (list.length) {
  if (list.filter(name => {
      const fileName = path.resolve(process.cwd(), path.join('.', name))
      const isDir = fs.statSync(fileName).isDirectory()
      return name.indexOf(projectName) !== -1 && isDir
    }).length !== 0) {
    console.error(logSymbols.error, chalk.red(`创建失败：项目${projectName}已经存在`))
    return
  }
  next = Promise.resolve(projectName)
} else if (rootName === projectName) {
  next = inquirer.prompt([
    {
      name: 'buildInCurrent',
      message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
      type: 'confirm',
      default: true
    }
  ]).then(answer => {
    return Promise.resolve(answer.buildInCurrent ? '.' : projectName)
  })
} else {
  next = Promise.resolve(projectName)
}

next && go()

function go () {
  next.then(projectRoot => {
    if (projectRoot !== '.') {
      fs.mkdirSync(projectRoot)
    }
    return download(projectRoot).then(target => {
      return {
        name: projectRoot,
        root: projectRoot,
        downloadTemp: target
      }
    })
  }).then(context => {
    return inquirer.prompt([
      {
        name: 'plugin_name',
        message: '插件的名称',
        default: 'ThsPlugin'
      }, {
        name: 'plugin_id',
        message: '插件的id',
        default: 'ths-native-plugin'
      }, {
        name: 'plugin_version',
        message: '插件的版本号',
        default: `1.0.0`
      }, {
        name: 'cordova_plugin_id',
        message: '对应的cordova插件的id',
        default: 'cordova-plugin-ths-pluginName'
      }, {
        name: 'plugin_description',
        message: '插件的简介',
        default: `A plugin named ThsPlugin`
      }, {
        name: 'plugin_github',
        message: '插件的git地址',
        default: 'https://github.com/apache/cordova-plugin-ths-pluginName'
      }
    ]).then(answers => {
      return latestVersion(answers.plugin_id).then(version => {
        answers.latest_version= version
        return {
          ...context,
          metadata: {
            ...answers
          }
        }
      }).catch(err => {
        return Promise.reject(err)
      })
    })
  }).then(context => {
    console.log(context)

    // 添加生成的逻辑
    return generator(context)
  }).then(context => {
    // 成功用绿色显示，给出积极的反馈
    console.log(logSymbols.success, chalk.green('创建成功:)'))
    console.log()

    // TODO: 暂时不移动文件夹
    const oldPath = `./${context.name}`
    const newPath = `./${context.metadata.plugin_id}`

    fs.renameSync(oldPath, newPath)

  }).catch(err => {
    // 失败了用红色，增强提示
    console.error(logSymbols.error, chalk.red(`创建失败：${err.message}`))
  })

}
