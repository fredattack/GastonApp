# GastonApp Landing Page

This is the landing page application for GastonApp, built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Modern SPA**: Single Page Application with React Router
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Fast Build**: Powered by Vite for lightning-fast builds
- **TypeScript**: Type-safe code throughout
- **SEO-Friendly**: Optimized for search engines

## Pages

- **Home**: Hero section, features overview, testimonials, and CTAs
- **Features**: Detailed feature descriptions and benefits
- **Pricing**: Pricing plans with FAQ section
- **Tutorials**: Tutorial library with categorization

## Development

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0

### Install Dependencies

```bash
# From the monorepo root
pnpm install
```

### Run Development Server

```bash
# From the monorepo root
pnpm dev:landing

# Or directly from this directory
pnpm dev
```

The app will be available at http://localhost:4481

### Build for Production

```bash
# From the monorepo root
pnpm build:landing

# Or directly from this directory
pnpm build
```

## Deployment

### Docker Deployment (Recommended)

The landing page can be deployed to a separate Digital Ocean droplet using Docker.

#### Build and Deploy

```bash
# From the monorepo root
pnpm deploy:landing

# Or manually
./.deploy-landing/deploy.sh
```

#### Docker Commands

```bash
# Build the Docker image
pnpm docker:landing:build

# Start the container
pnpm docker:landing:up

# Stop the container
pnpm docker:landing:down

# View logs
pnpm docker:landing:logs
```

### Manual Deployment

1. Build the application:
   ```bash
   pnpm build:landing
   ```

2. The built files will be in `apps/landing-page/dist`

3. Serve the `dist` folder using any static file server (nginx, Apache, etc.)

### Digital Ocean Droplet Setup

1. Create a new droplet with Ubuntu 22.04
2. Install Docker and Docker Compose
3. Clone the repository
4. Run the deployment script:
   ```bash
   ./deploy-landing/deploy.sh
   ```

5. Configure nginx reverse proxy (optional):
   ```nginx
   server {
       listen 80;
       server_name landing.gastonapp.com;

       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. Setup SSL with Let's Encrypt (optional):
   ```bash
   sudo certbot --nginx -d landing.gastonapp.com
   ```

## Project Structure

```
apps/landing-page/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Features.tsx
│   │   ├── Pricing.tsx
│   │   └── Tutorials.tsx
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Package dependencies
```

## Configuration

### Port

The development server runs on port **4481** by default. You can change this in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 4481,
  },
});
```

### Styling

The app uses Tailwind CSS for styling. The theme can be customized in `tailwind.config.js`.

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Check TypeScript types

## Links

- Main App: https://app.gastonapp.com
- Landing Page: https://landing.gastonapp.com (when deployed)

## License

Private - All rights reserved
