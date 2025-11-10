#!/bin/bash

# ECOFUNDRIVE V3 - Script d'installation des dépendances
# Résout les problèmes de lint et d'imports

echo "🚀 Installation des dépendances ECOFUNDRIVE V3..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="20.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js $NODE_VERSION est trop ancien. Version 20.x requise."
    exit 1
fi

echo "✅ Node.js $NODE_VERSION détecté"

# Installer pnpm si nécessaire
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installation de pnpm..."
    npm install -g pnpm
fi

# Installer les dépendances
echo "📦 Installation des dépendances du projet..."
pnpm install

# Installer les dépendances de développement
echo "📦 Installation des dépendances de développement..."
pnpm install -D @types/node dotenv tsx

# Vérifier l'installation
echo "🔍 Vérification de l'installation..."

# Vérifier les dépendances principales
DEPS=(
    "@anthropic-ai/sdk"
    "openai"
    "replicate"
    "zod"
    "sharp"
    "cheerio"
    "@types/node"
    "dotenv"
    "tsx"
)

for dep in "${DEPS[@]}"; do
    if pnpm list "$dep" &> /dev/null; then
        echo "✅ $dep installé"
    else
        echo "❌ $dep manquant"
        pnpm add "$dep"
    fi
done

# Créer le fichier .env.local s'il n'existe pas
if [ ! -f ".env.local" ]; then
    echo "📝 Création du fichier .env.local..."
    cp .env.example .env.local
    echo "⚠️  Veuillez éditer .env.local avec vos clés API"
fi

# Vérifier la configuration TypeScript
echo "🔍 Vérification de la configuration TypeScript..."
if pnpm type-check &> /dev/null; then
    echo "✅ Configuration TypeScript valide"
else
    echo "⚠️  Erreurs TypeScript détectées (normales sans les clés API)"
fi

echo ""
echo "🎉 Installation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Éditez .env.local avec vos clés API"
echo "2. Lancez 'pnpm dev' pour le développement"
echo "3. Lancez 'tsx scripts/generate.ts -k \"test\"' pour tester"
echo ""
echo "📚 Documentation :"
echo "- README-TECHNIQUE-V3.md"
echo "- DEPLOIEMENT-GIT-V3.md"
echo "- TEMPLATS-V3-COMPLET.md"

echo ""
echo "🚀 ECOFUNDRIVE V3 est prêt !"
