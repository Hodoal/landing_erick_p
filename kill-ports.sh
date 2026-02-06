#!/bin/bash

# Script para matar todos los puertos y limpiar procesos

echo "🔄 Matando procesos en puertos 3000 y 5173..."

# Matar procesos en puerto 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Matar procesos en puerto 5173
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Matar procesos tsx y vite
pkill -f "tsx watch" 2>/dev/null
pkill -f "vite" 2>/dev/null

echo "✅ Procesos terminados"
echo ""
echo "Puedes iniciar el proyecto con:"
echo "  npm run dev"
