#!/usr/bin/env bash
# 在项目根目录启动静态服务器
cd "$(dirname "$0")"
export PORT="${PORT:-8080}"
exec python3 serve.py
