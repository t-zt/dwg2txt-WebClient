#!/usr/bin/env python3
"""
DWG 转换工具 - 静态文件服务器
- 以项目根目录为 Web 根（满足 index.html 中 /wasm/ 绝对路径引用）
- 为 .wasm 返回正确的 application/wasm MIME（避免浏览器拒绝加载）
- 默认端口 8080，可用环境变量 PORT 覆盖
"""
import http.server
import socketserver
import os

PORT = int(os.environ.get("PORT", 8080))


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".wasm": "application/wasm",
        ".dwg": "application/octet-stream",
        ".dxf": "application/dxf",
    }


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"DWG converter serving on http://0.0.0.0:{PORT}")
        httpd.serve_forever()
