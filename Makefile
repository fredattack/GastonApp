# ==========================================
# GastonApp - Makefile
# ==========================================
# Gestion unifiée du monorepo frontend + backend Laravel
#
# Usage: make <command>
# Exemple: make dev
# ==========================================

.PHONY: help install dev dev-web dev-backend build clean test docker-up docker-down docker-logs backend-shell frontend-shell lint format deploy

# Variables
BACKEND_DIR := ../gaston-backend
FRONTEND_DIR := .
DOCKER_COMPOSE := docker compose
PNPM := pnpm

# Couleurs pour output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
BLUE := \033[0;34m
NC := \033[0m # No Color

##@ Général

help: ## Affiche l'aide
	@echo "$(BLUE)================================================$(NC)"
	@echo "$(BLUE)  GastonApp - Commandes Disponibles$(NC)"
	@echo "$(BLUE)================================================$(NC)"
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""

##@ Installation

install: install-frontend install-backend ## Installer toutes les dépendances (frontend + backend)
	@echo "$(GREEN)✓ Toutes les dépendances installées$(NC)"

install-frontend: ## Installer dépendances frontend (pnpm)
	@echo "$(BLUE)📦 Installation dépendances frontend...$(NC)"
	cd $(FRONTEND_DIR) && $(PNPM) install

install-backend: ## Installer dépendances backend (composer)
	@echo "$(BLUE)📦 Installation dépendances backend...$(NC)"
	cd $(BACKEND_DIR) && composer install

##@ Développement

dev: docker-up dev-web ## Lancer TOUT (backend Docker + frontend web)
	@echo "$(GREEN)✓ Tous les services sont lancés$(NC)"
	@echo "$(BLUE)Frontend:$(NC) http://localhost:4480"
	@echo "$(BLUE)Backend:$(NC)  http://localhost:3008"

dev-web: ## Lancer frontend web uniquement (port 4480)
	@echo "$(BLUE)🚀 Démarrage frontend web...$(NC)"
	cd $(FRONTEND_DIR) && $(PNPM) dev:web

dev-mobile: ## Lancer app mobile (future)
	@echo "$(BLUE)📱 Démarrage app mobile (non disponible)...$(NC)"
	@echo "$(YELLOW)App mobile pas encore implémentée$(NC)"

dev-backend: ## Lancer backend Laravel (sans Docker - dev local)
	@echo "$(BLUE)🔧 Démarrage backend Laravel...$(NC)"
	cd $(BACKEND_DIR) && php artisan serve --port=3008

dev-full: ## Lancer frontend + backend sans Docker (dev local complet)
	@echo "$(BLUE)🚀 Démarrage complet (frontend + backend local)...$(NC)"
	@make -j2 dev-web dev-backend

##@ Build

build: build-frontend build-backend ## Build tout (frontend + backend)
	@echo "$(GREEN)✓ Build complet terminé$(NC)"

build-frontend: ## Build frontend web pour production
	@echo "$(BLUE)🏗️  Build frontend...$(NC)"
	cd $(FRONTEND_DIR) && $(PNPM) build:web

build-backend: ## Build backend (composer optimize)
	@echo "$(BLUE)🏗️  Optimisation backend...$(NC)"
	cd $(BACKEND_DIR) && composer install --optimize-autoloader --no-dev

preview: build-frontend ## Preview build frontend
	@echo "$(BLUE)👁️  Preview frontend...$(NC)"
	cd $(FRONTEND_DIR) && $(PNPM) preview

##@ Docker (Backend)

docker-up: ## Démarrer containers Docker backend
	@echo "$(BLUE)🐳 Démarrage Docker backend...$(NC)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✓ Backend Docker démarré$(NC)"
	@echo "$(BLUE)API:$(NC) http://localhost:3008"
	@echo "$(BLUE)MySQL:$(NC) localhost:3368"

docker-down: ## Arrêter containers Docker backend
	@echo "$(BLUE)🛑 Arrêt Docker backend...$(NC)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) down

docker-restart: docker-down docker-up ## Redémarrer containers Docker

docker-logs: ## Voir logs Docker backend
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) logs -f

docker-ps: ## Lister containers Docker actifs
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) ps

docker-clean: ## Nettoyer Docker (volumes, images, etc.)
	@echo "$(RED)⚠️  Nettoyage complet Docker...$(NC)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) down -v --remove-orphans
	@echo "$(GREEN)✓ Docker nettoyé$(NC)"

##@ Base de données

db-migrate: ## Exécuter migrations Laravel
	@echo "$(BLUE)🗄️  Exécution migrations...$(NC)"
	cd $(BACKEND_DIR) && php artisan migrate

db-migrate-fresh: ## Reset DB + migrations
	@echo "$(RED)⚠️  Reset DB + migrations...$(NC)"
	cd $(BACKEND_DIR) && php artisan migrate:fresh

db-seed: ## Exécuter seeders
	@echo "$(BLUE)🌱 Exécution seeders...$(NC)"
	cd $(BACKEND_DIR) && php artisan db:seed

db-fresh-seed: ## Reset DB + migrations + seeders
	@echo "$(RED)⚠️  Reset complet DB...$(NC)"
	cd $(BACKEND_DIR) && php artisan migrate:fresh --seed

##@ Tests

test: test-frontend test-backend ## Lancer tous les tests
	@echo "$(GREEN)✓ Tous les tests terminés$(NC)"

test-frontend: ## Tests frontend
	@echo "$(BLUE)🧪 Tests frontend...$(NC)"
	cd $(FRONTEND_DIR) && $(PNPM) test

test-backend: ## Tests backend Laravel
	@echo "$(BLUE)🧪 Tests backend...$(NC)"
	cd $(BACKEND_DIR) && php artisan test

test-watch: ## Tests frontend en mode watch
	cd $(FRONTEND_DIR) && $(PNPM) test:watch

##@ Qualité de code

lint: lint-frontend lint-backend ## Lint tout
	@echo "$(GREEN)✓ Lint complet terminé$(NC)"

lint-frontend: ## Lint frontend
	@echo "$(BLUE)🔍 Lint frontend...$(NC)"
	cd $(FRONTEND_DIR) && $(PNPM) lint

lint-backend: ## Lint backend (PHPStan, Pint)
	@echo "$(BLUE)🔍 Lint backend...$(NC)"
	cd $(BACKEND_DIR) && ./vendor/bin/pint

format: format-frontend ## Format code frontend
	@echo "$(BLUE)✨ Format code frontend...$(NC)"
	cd $(FRONTEND_DIR) && $(PNPM) format

type-check: ## Vérifier types TypeScript
	@echo "$(BLUE)📋 Type check TypeScript...$(NC)"
	cd $(FRONTEND_DIR) && $(PNPM) type-check

##@ Nettoyage

clean: clean-frontend clean-backend ## Nettoyer tout
	@echo "$(GREEN)✓ Nettoyage complet terminé$(NC)"

clean-frontend: ## Nettoyer frontend (node_modules, dist)
	@echo "$(BLUE)🧹 Nettoyage frontend...$(NC)"
	cd $(FRONTEND_DIR) && rm -rf node_modules dist apps/*/node_modules apps/*/dist packages/*/node_modules packages/*/dist
	cd $(FRONTEND_DIR) && $(PNPM) store prune

clean-backend: ## Nettoyer backend (vendor, caches)
	@echo "$(BLUE)🧹 Nettoyage backend...$(NC)"
	cd $(BACKEND_DIR) && rm -rf vendor
	cd $(BACKEND_DIR) && php artisan cache:clear || true
	cd $(BACKEND_DIR) && php artisan config:clear || true
	cd $(BACKEND_DIR) && php artisan route:clear || true
	cd $(BACKEND_DIR) && php artisan view:clear || true

clean-cache: ## Vider tous les caches
	@echo "$(BLUE)🧹 Nettoyage caches...$(NC)"
	cd $(BACKEND_DIR) && php artisan cache:clear
	cd $(BACKEND_DIR) && php artisan config:clear
	cd $(BACKEND_DIR) && php artisan route:clear
	cd $(BACKEND_DIR) && php artisan view:clear
	cd $(FRONTEND_DIR) && rm -rf .turbo

##@ Shell & Debug

backend-shell: ## Ouvrir shell dans container backend
	@echo "$(BLUE)🐚 Ouverture shell backend...$(NC)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) exec app bash

db-shell: ## Ouvrir MySQL shell
	@echo "$(BLUE)🗄️  Ouverture MySQL shell...$(NC)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) exec db mysql -u root -p

tinker: ## Ouvrir Laravel Tinker
	@echo "$(BLUE)⚡ Laravel Tinker...$(NC)"
	cd $(BACKEND_DIR) && php artisan tinker

##@ Git

git-status: ## Status Git (frontend + backend)
	@echo "$(BLUE)📊 Git status frontend:$(NC)"
	@cd $(FRONTEND_DIR) && git status -s
	@echo ""
	@echo "$(BLUE)📊 Git status backend:$(NC)"
	@cd $(BACKEND_DIR) && git status -s

git-pull: ## Pull Git (frontend + backend)
	@echo "$(BLUE)⬇️  Git pull frontend...$(NC)"
	cd $(FRONTEND_DIR) && git pull
	@echo "$(BLUE)⬇️  Git pull backend...$(NC)"
	cd $(BACKEND_DIR) && git pull

git-push: ## Push Git (frontend + backend)
	@echo "$(BLUE)⬆️  Git push frontend...$(NC)"
	cd $(FRONTEND_DIR) && git push
	@echo "$(BLUE)⬆️  Git push backend...$(NC)"
	cd $(BACKEND_DIR) && git push

##@ Déploiement

deploy: build docker-build docker-up ## Build + deploy complet
	@echo "$(GREEN)✓ Déploiement terminé$(NC)"

docker-build: build-frontend ## Build image Docker
	@echo "$(BLUE)🐳 Build image Docker...$(NC)"
	cd $(FRONTEND_DIR) && docker build -t gastonapp-web -f .deploy/Dockerfile .

docker-push: ## Push image vers registry
	@echo "$(BLUE)⬆️  Push image Docker...$(NC)"
	docker push gastonapp-web:latest

##@ Info

info: ## Afficher infos système
	@echo "$(BLUE)================================================$(NC)"
	@echo "$(BLUE)  GastonApp - Informations Système$(NC)"
	@echo "$(BLUE)================================================$(NC)"
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@echo "  Directory: $(FRONTEND_DIR)"
	@echo "  Node: $$(node --version 2>/dev/null || echo 'Non installé')"
	@echo "  pnpm: $$(pnpm --version 2>/dev/null || echo 'Non installé')"
	@echo ""
	@echo "$(YELLOW)Backend:$(NC)"
	@echo "  Directory: $(BACKEND_DIR)"
	@echo "  PHP: $$(php --version 2>/dev/null | head -n 1 || echo 'Non installé')"
	@echo "  Composer: $$(composer --version 2>/dev/null | head -n 1 || echo 'Non installé')"
	@echo ""
	@echo "$(YELLOW)Docker:$(NC)"
	@echo "  Version: $$(docker --version 2>/dev/null || echo 'Non installé')"
	@echo "  Compose: $$(docker compose version 2>/dev/null || echo 'Non installé')"
	@echo ""
	@echo "$(YELLOW)Services actifs:$(NC)"
	@cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) ps 2>/dev/null || echo "  Aucun container Docker actif"
	@echo ""

ports: ## Vérifier ports utilisés
	@echo "$(BLUE)Ports utilisés:$(NC)"
	@echo "  Frontend web: 4480"
	@echo "  Backend API:  3008"
	@echo "  MySQL:        3368"
	@echo ""
	@echo "$(YELLOW)Vérification:$(NC)"
	@lsof -i :4480 || echo "  Port 4480 libre"
	@lsof -i :3008 || echo "  Port 3008 libre"
	@lsof -i :3368 || echo "  Port 3368 libre"

##@ Raccourcis pratiques

start: dev ## Alias pour 'make dev'

stop: docker-down ## Arrêter tout

restart: docker-restart ## Redémarrer backend Docker

logs: docker-logs ## Alias pour 'docker-logs'

shell: backend-shell ## Alias pour 'backend-shell'

fresh: clean install ## Réinstaller tout depuis zéro
	@echo "$(GREEN)✓ Installation fraîche terminée$(NC)"

reset: clean-cache db-fresh-seed ## Reset complet (DB + caches)
	@echo "$(GREEN)✓ Reset complet terminé$(NC)"

watch: ## Watch mode frontend (hot reload)
	cd $(FRONTEND_DIR) && $(PNPM) dev:web

##@ Utilitaires

update: update-frontend update-backend ## Mettre à jour dépendances
	@echo "$(GREEN)✓ Toutes les dépendances mises à jour$(NC)"

update-frontend: ## Mettre à jour dépendances frontend
	@echo "$(BLUE)⬆️  Update dépendances frontend...$(NC)"
	cd $(FRONTEND_DIR) && $(PNPM) update

update-backend: ## Mettre à jour dépendances backend
	@echo "$(BLUE)⬆️  Update dépendances backend...$(NC)"
	cd $(BACKEND_DIR) && composer update

check: lint type-check test ## Vérification complète avant commit
	@echo "$(GREEN)✓ Toutes les vérifications passées$(NC)"

ci: install build lint type-check test ## Simulation CI (pour tester localement)
	@echo "$(GREEN)✓ CI simulation terminée$(NC)"