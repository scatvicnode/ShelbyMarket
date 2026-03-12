# ShelbyMarket

The Data Layer for Decentralized AI. ShelbyMarket is a decentralized marketplace for high-value AI datasets, allowing users to publish, monetize, and fetch training data, RAG corpora, and embeddings with cryptographic access proofs. Settled on Aptos, delivered by DoubleZero.

## Features

- **Decentralized Dataset Publishing**: Upload and register datasets directly to the Shelby Network using cryptographic Merkle commitments.
- **Data Monetization & Licensing**: Set prices and license types for your datasets. Payments are settled securely via Aptos smart contracts.
- **Cryptographic Access Proofs**: Ensure that only buyers with verified on-chain access proofs can download the dataset.
- **MCP (Model Context Protocol) Support**: Filter and discover datasets specifically optimized and formatted for MCP-enabled AI agents.
- **Aptos Wallet Integration**: Seamless integration with Aptos wallets (like Petra) for signing transactions and paying for datasets.
- **Beautiful & Responsive UI**: Built with React, Tailwind CSS, and Framer Motion, featuring a modern glassmorphic design and the signature Shelby Pink theme.

## Tech Stack

- **Frontend Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS for glassmorphism and gradients
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Blockchain Integration**:
  - `aptos` SDK for wallet and transaction handling
  - `shelby-sdk` for interacting with the Shelby Network (Erasure Coding, Merkle commitments, Blob uploads)
- **Routing**: `react-router-dom`

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn or pnpm
- An Aptos-compatible wallet extension (e.g., Petra Wallet) installed in your browser.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd ShelbyMarket
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure your Shelby SDK environment:
   ```env
   VITE_SHELBY_API_KEY=your_api_key_here
   VITE_NETWORK=testnet
   ```

### Running the Development Server

Start the local development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Building for Production

To build the application for production:

```bash
npm run build
```

This will output the compiled and minified assets into the `dist/` directory.

## Smart Contracts

ShelbyMarket interacts with the Shelby Protocol smart contracts deployed on the Aptos network. Specifically, it calls the `register_blob` function in the `blob_metadata` module to commit datasets on-chain.

## License

MIT License. See [LICENSE](LICENSE) for more details.
