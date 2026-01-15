# Fundable Stellar Client

Stellar client for the Fundable Protocol – a decentralized payment platform that enables seamless Web3 payments, streaming, and subscriptions. This client provides the user interface for interacting with Fundable's smart contracts deployed on the Stellar blockchain.

## Features

- 🌟 Native Stellar blockchain integration
- 💸 Payment streaming and subscriptions
- 🔐 Secure wallet connection (Freighter, etc.)
- 📊 Dashboard for payment management
- 💱 Offramp to fiat currencies
- 🌐 Multi-asset support (XLM, USDC, etc.)

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui (new-york style)
- **Package Manager:** pnpm
- **Bundler:** Turbopack

## Getting Started

### Prerequisites

- Node.js v18 or higher
- pnpm v8 or higher
- Git

### Installation

1. Clone the repository:
```bash
git clone git@github.com:Fundable-Protocol/stellar_client.git
cd stellar_client
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Fundable Stellar
NEXT_PUBLIC_API_URL=<your-backend-api-url>
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=<stellar-rpc-url>
NEXT_PUBLIC_STELLAR_HORIZON_URL=<horizon-url>
```

5. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build production bundle |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Project Structure

```
stellar_client/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   │   ├── ui/        # Shadcn UI components
│   │   └── modules/   # Feature-specific modules
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── services/      # API service layer
│   ├── types/         # TypeScript type definitions
│   ├── providers/     # React context providers
│   ├── store/         # State management
│   ├── config/        # Configuration files
│   ├── assets/        # Static assets (fonts, etc.)
│   ├── middlewares/   # Custom middlewares
│   ├── policies/      # Access control policies
│   └── validations/   # Form validation schemas
├── public/            # Public static assets
└── ...config files
```

## Related Repositories

- [backend-main](https://github.com/Fundable-Protocol/backend-main) - Backend API services
- [evm_client](https://github.com/Fundable-Protocol/evm_client) - EVM-compatible client

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is part of the Fundable Protocol.
