#!/usr/bin/env node

const program = require('commander')

program.version('1.0.0')
  .usage('<command> [项目名称]')
  .command('create-ionic-native', '创建ionic-native插件')
  .parse(process.argv)
