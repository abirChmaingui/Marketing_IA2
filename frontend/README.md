# Assistant Marketing Bancaire - Frontend

Application web moderne de génération de contenus marketing pour les communications bancaires.

## Technologies

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- React Router, Axios, React Hook Form, Zod
- Recharts, Lucide Icons

## Installation

```bash
npm install
npm run dev
```

## Connexion (mock)

Utilisez n'importe quel email valide et un mot de passe d'au moins 6 caractères.

## Structure

```
src/
├── components/     # Composants réutilisables
├── pages/          # Pages de l'application
├── layouts/        # Layouts (Auth, Dashboard)
├── services/       # API et mock data
├── hooks/          # Hooks personnalisés
├── contexts/       # Contextes React (Auth, Theme)
├── types/          # Types TypeScript
├── utils/          # Utilitaires
└── assets/         # Ressources statiques
```

## Pages

1. Login - Connexion
2. Dashboard - Tableau de bord avec statistiques et graphiques
3. Génération de texte - Création de contenus multicanaux
4. Génération d'images - Création de visuels
5. Génération de vidéos - Création de vidéos marketing
6. Historique - Tableau avec recherche, filtres et pagination
7. Modèles - Bibliothèque de templates bancaires
8. Profil - Gestion du compte utilisateur
9. Paramètres - Langue, thème, notifications, API Key
