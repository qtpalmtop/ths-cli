# ths-cli
思路脚手架第一版, 目前只有create-ionic-native命令，可以创建@ionic-native插件供angular项目使用
```ths-cli
Usage: ths-cli <command> [项目名称]

Options:
  -V, --version        output the version number
  -h, --help           display help for command

Commands:
  create-ionic-native  创建ionic-native插件
  help [command]       display help for command
  ```
# 安装
```linux
npm install ths-cli2 -g
```
# 使用
```linux
ths-cli create-ionic-native ths-native-toast
```
create-ionic-native 表示创建ionic-native插件指令
ths-native-toast 表示想要生成的插件名称

# 演示
```linux
ths-cli create-ionic-native ths-native-toast
```
> 正在下载项目模板，源地址：git@github.com:qtpalmtop/templates-ionic-native.git#master
> 插件的名称 (ThsPlugin): ThsToast
> 插件的id (ths-native-plugin): ths-native-toast
> 插件的版本号 (1.0.0): 1.0.0 
> 对应的cordova插件的id  (cordova-plugin-ths-pluginName): cordova-plugin-ths-toast
> 插件的简介 (A plugin named ThsPlugin): show toast
> 插件的git地址 (https://github.com/apache/cordova-plugin-ths-pluginName): https://github.com/qtpalmtop/cordova-plugin-ths-toast
正在初始化项目模板：ths-native-toast/ths-native-toast
✔ 创建成功:)

之后当前目录下将会出现ths-native-toast插件
```linux
cd ths-native-toast
npm publish
```
随后在angular项目中即可通过npm install ths-native-toast, 并在app.module.ts中导入插件
``` typescript
// app.mocule.ts 
import { ThsToast } from 'ths-native-toast/ngx';

@NgModule({
...,
providers: [
    ...,
    ThsToast
  ]
})
```
然后在使用的模块中导入sdk就能直接调用起cordova插件功能

``` typescript
// app.component.ts
import { ThsToast } from 'ths-native-toast/ngx';

export class AppComponent {
    constructor(
        private thsToast: ThsToast
    ) {
        this.thsToast.show();
    }
}
```

注意：安装ionic-native插件之前需要先执行指令安装cordova插件
```linux
cordova plugin add cordova-plugin-ths-toast 或
ionic cordova plugin add cordova-plugin-ths-toast
```
此处的Cordova 插件名称需和脚手架输入的cordova_plugin_id相同
```
> 对应的cordova插件的id  (cordova-plugin-ths-pluginName): cordova-plugin-ths-toast
```
