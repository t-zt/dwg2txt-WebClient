# DWG 地块坐标 & DXF 转换工具

纯浏览器端（Client-side）的 DWG 文件转换工具：上传 DWG，自动提取地块坐标（txt）并生成 DXF 文件。**所有计算在本地完成，文件不上传任何服务器。**

## 目录结构

```
dwg-converter/
├── index.html          # 主页面
├── wasm/
│   ├── dwg2pol.js      # WASM 胶水代码（坐标 / 多边形提取引擎）
│   ├── dwg2pol.wasm    # WASM 二进制（约 6MB）
│   └── dxfgen.js       # DXF 生成逻辑
├── serve.py            # 静态服务器（自动设置 application/wasm MIME）
└── run.sh              # 一键启动脚本
```

## 本地运行

⚠️ 页面通过**绝对路径** `/wasm/...` 引用资源，因此必须以项目**根目录**作为 Web 根。
请勿用 `file://` 直接打开 `index.html`（WASM 会被浏览器安全策略拦截）。

```bash
python3 serve.py
# 或
bash run.sh
```

然后浏览器访问 `http://localhost:8080`。

## 说明

- WASM 引擎首次加载约 6MB，需 5–10 秒编译，请耐心等待「WASM 引擎已就绪」提示。
- 适用于大文件，无服务器端大小限制。
- `serve.py` 已为 `.wasm` 显式设置 `application/wasm`，确保正确实例化 WASM。
