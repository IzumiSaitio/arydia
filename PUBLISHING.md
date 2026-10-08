# 发布维护

GitHub 仓库 Settings → Pages → Source 选择 **GitHub Actions**。默认分支为 main。
提交 main 后会先校验网页版和 APK、创建 Release，再发布网页版及更新信息。

图片、图标和音乐保存在 web/assets.zip，发布时自动解压。网页代码位于 web/dist。

网页入口：https://izumisaitio.github.io/arydia/
安卓下载：https://github.com/IzumiSaitio/arydia/releases

网页版延续原有网页界面，当前与原生安卓的界面和语言功能并非完全一致。浏览器存档保存在本机；不提供账号同步。音乐可按需缓存。

## 后续更新

1. 用原签名打包 APK。内部 versionCode 必须递增；只有作者要求时才修改可见版本号。
2. 将新版 APK 按字节切成两个部分，替换 release/Arydia-3.8.0.apk.part1 和 part2；自动发布时会合并并校验完整 APK。更新 release/manifest.json 的新 tag 和 SHA-256。
3. 同步 web/dist/update.json 的内部版本号、下载页面、SHA-256、中英文更新内容；更新 release/notes.md。
4. 提交后在 Actions 确认发布成功。相同 tag 的 APK 不允许悄悄覆盖，应使用新的 tag。

安卓只读取公开版本信息，不上传存档，不需要用户登录 GitHub。弹窗引导用户打开下载页安装；不静默安装。旧 APK 没有检查更新功能，需要先手动安装带此功能的版本。

本仓库不包含安卓源码、签名密钥或构建密码。游戏原有图文和音乐的权利归各自权利人所有。
