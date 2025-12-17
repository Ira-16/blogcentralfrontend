# INTWORK Frontend - Copilot Instructions

## Project Overview
React 19 + Vite frontend connecting to Spring Boot backend at `http://localhost:8087`. JWT auth with roles: ADMIN, MANAGER, USER.

## Quick Reference

### Imports - Always use `@/` alias
```jsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/useAuth";
import { getAllPosts } from "@/api/apiService";
import { formatRelativeTime } from "@/utils/formatDate";
```

### Commands
```bash
npm run dev      # Dev server with HMR
npm run build    # Production build
npm run lint     # ESLint check
```

## Architecture Patterns

### API Layer (`src/api/`)
- All API calls export from `apiService.js` - add new endpoints there
- Auth calls use base `api` instance directly: `api.post("/auth/login", form)`
- **Critical**: API responses vary - always handle both patterns:
```jsx
const postsArray = Array.isArray(res.data) ? res.data : res.data.data || [];
```

### Authentication (`src/auth/`)
- `useAuth()` hook returns `{ token, user, login, logout }`
- JWT decoded client-side in Login.jsx: `payload.sub` = username, `payload.role` = role
- Token auto-attached via axios interceptor in `axios.js`
- User object shape: `{ username: string, role: "ADMIN" | "MANAGER" | "USER" }`
- Use `<PrivateRoute>` to protect routes requiring auth:
```jsx
<Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
```

### Component Structure
- **UI primitives** (`src/components/ui/`): shadcn components with `cva` variants
- **Feature components** (`src/components/`): PostCard, CommentList, NavBar, etc.
- **Pages** (`src/pages/`): One component per route, add routes in `App.jsx`
- **Utilities** (`src/utils/`): `formatDate.js` for date formatting helpers

### Role-Based UI Pattern (see `NavBar.jsx`)
```jsx
{token && user?.role === "ADMIN" && <Link to="/create">Create Post</Link>}
{token && user?.role === "USER" && <Link to="/myposts">My Posts</Link>}
```

## Key Conventions

### Forms - Object state pattern (preferred)
```jsx
const [form, setForm] = useState({ username: "", password: "" });
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};
```

### Loading/Error/Empty States (follow `Home.jsx` pattern)
```jsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
// Always handle: loading → error → empty → success states
// Use <Loader /> component and lucide-react icons for states
```

### Styling
- Tailwind utilities + shadcn variants: `variant="destructive"`, `size="sm"`
- Use `cn()` from `@/lib/utils` for conditional classes
- Icons from `lucide-react`: `import { Calendar, User, ArrowRight } from "lucide-react"`

## Adding Features

| Task | Location | Example |
|------|----------|---------|
| New API call | `src/api/apiService.js` | `export const deletePost = (id) => api.delete(\`/api/posts/\${id}\`);` |
| New page | `src/pages/` + `App.jsx` route | `<Route path="/new" element={<NewPage />} />` |
| New UI component | `npx shadcn@latest add <name>` | Adds to `src/components/ui/` |
| Protected route | Wrap with `<PrivateRoute>` | Check `user.role` for authorization |
| Date formatting | Use `formatRelativeTime()` or `formatDate()` | From `@/utils/formatDate` |

## Backend Endpoints
- Auth: `POST /auth/login`, `POST /auth/register`
- Posts: `GET/POST /api/posts`, `GET/PUT /api/posts/:id`
- Comments: `GET/POST /api/posts/:postId/comments`, `PUT/DELETE /api/comments/:id`
- Search: `GET /search/posts?keyword=`
