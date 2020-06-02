// npm i handlebars metalsmith -D
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const ora = require('ora')
const rm = require('rimraf').sync

module.exports = function (context) {

  let metadata = context.metadata;
  let src = context.downloadTemp;
  let dest = './' + context.root;

  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }

  const spinner = ora(`正在初始化项目模板：${context.name}/${metadata.plugin_id}`).start();

  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        Object.keys(files).forEach(fileName => {
          const t = files[fileName].contents.toString()
          files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
        })
        done()
      }).build(err => {
        rm(src)

        if (err) {
          spinner.fail()
          reject(err)
        } else {
          spinner.succeed()
          resolve(context)
        }

    })
  })
}
