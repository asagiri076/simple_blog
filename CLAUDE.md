# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production 
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting

## Environment Setup

Requires environment variables for microCMS integration:
- `MICROCMS_API_KEY` - microCMS API key
- `MICROCMS_DOMAIN` - microCMS service domain

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS v4 
- microCMS for content management
- ESLint with Next.js and TypeScript rules

## Architecture

This is a simple blog built with Next.js 15 and TypeScript, designed to integrate with microCMS for content management and use SSG (Static Site Generation).

### Page Structure (App Router)
- `/` - Homepage with article list (latest articles)
- `/tag/[tagId]` - Tag-based article filtering (same component as homepage)
- `/article/[articleId]` - Individual article pages
- 404 pages for non-existent articles/tags

### Key Design Decisions
- Homepage and tag listing pages are unified in a single component that branches based on URL parameters
- microCMS integration planned for content fetching
- SSG approach for performance
- Sidebar with popular articles (CSR API fetching) and tag list (common across all pages)
- Responsive design for PC/tablet/mobile
- SEO optimization with proper meta tags and OGP

### Component Organization
- Common components: Site header/logo, sidebar, footer
- Sidebar includes: Popular articles ranking (CSR), tag list (static)
- Error handling for API failures in CSR components
- Accessibility considerations (alt attributes, contrast, keyboard navigation)
- Image optimization and lazy loading

### Content Structure
Articles should include: title, featured image, publication date, tags, summary, and rich text content.

### Data Layer
- `src/lib/microcms.ts` - microCMS API client with functions for fetching posts, categories, and popular posts
- `src/types/microcms.ts` - TypeScript interfaces for Post, Category, and API responses
- Uses `@/` path alias for imports (configured in tsconfig.json)

### API Routes
- `/api/popular-posts` - CSR endpoint for sidebar popular posts
- `/api/related-posts` - CSR endpoint for related posts functionality

Refer to `docs/dd.md` for detailed screen design specifications.