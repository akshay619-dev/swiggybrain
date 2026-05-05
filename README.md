# SwiggyBrain

An AI food decision engine built on [Swiggy's MCP APIs](https://mcp.swiggy.com/builders). It replaces 15 minutes of scrolling with a single, opinionated recommendation in 10 seconds.

You tell it what you need in plain language. It searches restaurants, compares dish-level pricing, auto-applies the best coupon, and tells you exactly what to order — across Food, Instamart, and Dineout.

Built for the **Swiggy Builders Club 2026**.

---

## What It Does

- **"Lunch under 300"** — searches nearby restaurants, picks the best dish, applies the best coupon, recommends ONE option with reasoning
- **"Best butter chicken near me"** — compares the same dish across multiple restaurants by price, rating, and delivery time
- **"Cook or order paneer tonight?"** — shows Food delivery price vs Instamart ingredient cost side-by-side
- **"Dinner for 2, she wants South Indian, I want Chinese"** — finds restaurants that satisfy multiple dietary preferences
- **"Friends coming Saturday, budget 4000"** — compares ordering in (Food), cooking (Instamart), and going out (Dineout)

## How It Works

```
User message → LLM Agent → Swiggy MCP Tools (35) → Streamed response with rich cards
```

The LLM (OpenAI GPT-4o primary, Claude fallback) orchestrates all 35 Swiggy MCP tools through function calling. No database. No scheduler. The intelligence is in how the agent chains tool calls — search restaurants, browse menus, fetch coupons, compare prices, build carts — all within a single conversation turn.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2, React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| AI | OpenAI GPT-4o + Anthropic Claude (fallback) |
| APIs | Swiggy MCP — Food, Instamart, Dineout |
| Auth | Swiggy OAuth 2.1 with PKCE |
| Deployment | Vercel |

## Project Structure

```
swiggybrain/
├── app/
│   ├── page.tsx                         # Landing page
│   ├── chat/page.tsx                    # Chat UI
│   ├── layout.tsx                       # Root layout (Inter font, dark theme)
│   ├── globals.css                      # Design system (cards, buttons, animations)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts           # OAuth PKCE initiation
│       │   ├── callback/route.ts        # Token exchange
│       │   └── logout/route.ts          # Clear session
│       └── chat/route.ts               # Streaming chat endpoint (SSE)
│
├── lib/
│   ├── mcp/                             # Swiggy MCP client layer
│   │   ├── client.ts                    # Base HTTP client (JSON-RPC, retry, error mapping)
│   │   ├── types.ts                     # TypeScript types for all API responses
│   │   ├── food.ts                      # Food server — 14 tool wrappers
│   │   ├── instamart.ts                 # Instamart server — 13 tool wrappers
│   │   ├── dineout.ts                   # Dineout server — 8 tool wrappers
│   │   ├── mock-data.ts                 # Realistic mock data (Bangalore restaurants, products)
│   │   └── mock-client.ts              # Mock tool executor for dev mode
│   │
│   ├── ai/                              # AI agent layer
│   │   ├── agent.ts                     # Core function-calling loop with streaming
│   │   ├── tools.ts                     # 35 tool definitions + execution router
│   │   ├── prompts.ts                   # System prompt (personality, modes, safety rules)
│   │   └── providers/
│   │       ├── types.ts                 # LLMProvider interface
│   │       ├── openai.ts               # OpenAI GPT-4o implementation
│   │       ├── anthropic.ts            # Claude implementation
│   │       └── fallback.ts             # Primary/secondary fallback + factory
│   │
│   ├── auth/                            # Authentication
│   │   ├── pkce.ts                      # PKCE code verifier/challenge generation
│   │   └── tokens.ts                    # Token cookie management
│   │
│   └── utils/
│       └── errors.ts                    # MCPError, LLMError, AuthError
│
├── components/
│   ├── chat/                            # Chat UI components
│   │   ├── ChatWindow.tsx               # Message list with auto-scroll
│   │   ├── ChatInput.tsx                # Input bar with send button
│   │   ├── MessageBubble.tsx            # Message rendering + card parsing
│   │   └── StreamingMessage.tsx         # Streaming response display
│   │
│   ├── cards/                           # Rich card components
│   │   ├── FoodCard.tsx                 # Restaurant + dish recommendation
│   │   ├── ComparisonCard.tsx           # Cook vs Order side-by-side
│   │   ├── DineoutCard.tsx              # Restaurant reservation
│   │   └── CartCard.tsx                 # Order summary + confirmation
│   │
│   └── ui/                              # shadcn/ui primitives
│
└── middleware.ts                         # Auth guard for /chat routes
```

## Architecture

```
┌─────────────────────────────┐
│       Chat UI (React)       │
│  Messages · Cards · Stream  │
└──────────────┬──────────────┘
               │ POST /api/chat (SSE)
               ▼
┌─────────────────────────────┐
│     LLM Agent (agent.ts)    │
│  System prompt + tool loop  │
│  OpenAI ←→ Claude fallback  │
└──────────────┬──────────────┘
               │ Function calls
               ▼
┌─────────────────────────────┐
│   Tool Registry (tools.ts)  │
│     35 tool definitions     │
│    + execution router       │
└──────────────┬──────────────┘
               │
      ┌────────┼────────┐
      ▼        ▼        ▼
┌─────────┐┌────────┐┌────────┐
│  Food   ││Instamart││Dineout │
│14 tools ││13 tools ││8 tools │
└────┬────┘└───┬────┘└───┬────┘
     └─────────┼─────────┘
               ▼
┌─────────────────────────────┐
│     Swiggy MCP Servers      │
│  mcp.swiggy.com/food        │
│  mcp.swiggy.com/im          │
│  mcp.swiggy.com/dineout     │
└─────────────────────────────┘
```

## SOLID Principles

| Principle | Implementation |
|---|---|
| **Single Responsibility** | `lib/mcp/` talks to Swiggy. `lib/ai/` orchestrates the LLM. `lib/auth/` handles tokens. Components only render. |
| **Open/Closed** | New LLM providers implement `LLMProvider` interface — no changes to agent. New conversation modes extend `prompts.ts` — no changes to the loop. |
| **Liskov Substitution** | OpenAI and Claude providers are fully interchangeable through the same interface. |
| **Interface Segregation** | Card components receive only the data they need. Chat components don't know about MCP types. |
| **Dependency Inversion** | Agent depends on `LLMProvider` interface, not concrete OpenAI/Anthropic. Tools are injected via registry. |

## Getting Started

### Prerequisites

- Node.js 20+
- An OpenAI API key and/or Anthropic API key
- (Optional) Swiggy Builders Club `client_id` for production API access

### Installation

```bash
git clone https://github.com/akshay619-dev/swiggybrain.git
cd swiggybrain
npm install
```

### Configuration

Create `.env.local` in the project root:

```env
# Swiggy (leave empty until you have production credentials)
SWIGGY_CLIENT_ID=

# LLM (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PRIMARY_LLM=openai

# Auth
REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Dev mode (set both to false for production)
DEV_MODE=true
MOCK_MCP=true
```

### Run

```bash
npm run dev
```

Open http://localhost:3000. In dev mode, click "Continue without login" to access the chat directly with mock Swiggy data.

### Production

Set `DEV_MODE=false` and `MOCK_MCP=false` in `.env.local`, add your `SWIGGY_CLIENT_ID`, and the app will use real Swiggy MCP APIs with OAuth authentication.

## MCP Tools Used (35 total)

### Food (14)
`get_addresses` · `search_restaurants` · `get_restaurant_menu` · `search_menu` · `get_food_cart` · `update_food_cart` · `flush_food_cart` · `fetch_food_coupons` · `apply_food_coupon` · `place_food_order` · `get_food_orders` · `get_food_order_details` · `track_food_order` · `report_error`

### Instamart (13)
`get_addresses` · `create_address` · `delete_address` · `search_products` · `your_go_to_items` · `get_cart` · `update_cart` · `clear_cart` · `checkout` · `get_orders` · `get_order_details` · `track_order` · `report_error`

### Dineout (8)
`get_saved_locations` · `search_restaurants_dineout` · `get_restaurant_details` · `get_available_slots` · `create_cart` · `book_table` · `get_booking_status` · `report_error`

## LLM Fallback

The agent uses OpenAI GPT-4o as the primary model. If it fails (rate limit, server error, timeout), it automatically switches to Claude and continues the conversation. Configurable via `PRIMARY_LLM` env var.

```
Request → OpenAI GPT-4o
            │
            ├─ Success → stream response
            │
            └─ 429/5xx/timeout
                  │
                  ▼
              Claude Sonnet → stream response
```

## Key Design Decisions

- **No database** — conversation state lives in React state. Page refresh = fresh chat. Fully compliant with Swiggy's "no PII persistence" policy.
- **No scheduler** — all orders are instant (Swiggy MCP v1 doesn't support future ordering).
- **Confirmation gate** — the agent NEVER places an order or books a table without explicit user confirmation. Enforced in the system prompt.
- **COD only** — Swiggy MCP v1 supports Cash on Delivery only.
- **Single-restaurant cart** — switching restaurants flushes the cart. The agent warns users when this happens.

## Deploy

```bash
vercel deploy
```

Add the environment variables in the Vercel dashboard. For production Swiggy access, whitelist your production redirect URI with the Swiggy team (`builders@swiggy.in`).

## License

MIT
