#!/usr/bin/env bash
# Cloud Studio 运行入口：在项目根目录启动静态服务器
cd "$(dirname "$0")"
PORT="${PORT:-8080}"
exec python3 serve.py
