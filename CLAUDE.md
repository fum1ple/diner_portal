# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

Diner Portal is a restaurant information management system with:
- **Backend**: Rails API (Ruby 3.2.8, Rails 7.1.5+) running on port 3000
- **Frontend**: Next.js 14 with App Router (Node.js 20+) running on port 4000
- **Database**: PostgreSQL 15-alpine
- **Development**: Docker Compose-based environment

## Critical Commands

### Development Setup
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f frontend
docker compose logs -f backend

# Rebuild containers
docker compose build --no-cache
```

### Frontend Commands (MUST use Yarn - npm is forbidden)
```bash
cd frontend
yarn dev        # Start development server
yarn build      # Production build
yarn lint       # Run ESLint
yarn lint:fix   # Fix linting issues
yarn type-check # TypeScript checking
```

### Backend Commands
```bash
cd backend
bundle exec rails s           # Start server
bundle exec rspec            # Run all tests
bundle exec rspec spec/[path] # Run specific test
bundle exec rails db:migrate  # Run migrations
bundle exec rails db:seed     # Seed database
```

### Testing Commands
```bash
# Backend API tests
cd backend && bundle exec rspec

# Run specific test file
bundle exec rspec spec/requests/api/restaurants_controller_spec.rb

# Run with specific example
bundle exec rspec spec/requests/api/restaurants_controller_spec.rb -e "returns restaurants"
```

## Critical Constraints

1. **RSpec Version**: LOCKED at version 7.0 - Never change this
2. **Package Manager**: Frontend MUST use Yarn (npm forbidden)
3. **Authentication Domain**: Only `tokium.jp` domain allowed
4. **Node Version**: Must be v20 or higher

## Key Implementation Details

### Test Driven Development
- As a general principle, proceed with Test-Driven Development (TDD).
- First, create tests based on the expected input and output.
- Write only the tests, without any implementation code.
- Run the tests and confirm that they fail.
- Once you have confirmed that the tests are correct, commit them.
- After that, proceed with the implementation to make the tests pass.
- Do not change the tests during implementation; continue to modify the code.
- Repeat until all tests pass.

### Authentication Flow
- Google OAuth 2.0 with JWT tokens
- All API endpoints require Bearer token authentication
- Tokens managed by `JwtService` and `RefreshTokenService`
- Frontend uses NextAuth.js v4 with custom JWT session handling

### API Structure
- RESTful design: `/api/restaurants`, `/api/reviews`, `/api/tags`
- All responses in JSON format
- Authentication via `Authorization: Bearer <token>` header
- CORS configured for frontend origin

### Frontend State Management
- TanStack Query for server state
- Context API for local state (e.g., RestaurantDetailContext)
- Custom hooks pattern: `useAuth`, `useRestaurantDetail`, `useCreateReview`

### Database Schema
Key models and relationships:
- User has_many Reviews
- Restaurant has_many Reviews
- Restaurant has `average_rating` and `review_count` (denormalized for performance)
- Tags (polymorphic: area_tags, genre_tags, scene_tags)

## Development Workflow

When implementing new features:
1. Check existing patterns in similar controllers/components
2. Maintain JWT authentication for all API endpoints
3. Use existing UI components from `components/ui/`
4. Follow RESTful conventions for new endpoints
5. Add appropriate RSpec tests for backend changes
6. Ensure TypeScript types are properly defined for frontend