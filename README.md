# BlockPermit

BlockPermit is a Next.js application designed for project management that utilizes blockchain technology for secure and transparent operations. The application integrates with MetaMask for authentication, providing a user-friendly, secure, and reliable interface for managing projects.

## Features

- Blockchain Integration: All operations are securely logged in the blockchain providing immutable and verifiable records.
- MetaMask Authentication: Easy and secure authentication via MetaMask.
- Project Management: Manage projects and coordinate with administrative authorities and opinion provider to speed up your project development.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/).
- You have a basic understanding of JavaScript and React.js.
- You have MetaMask installed and set up in your browser. If you don't, refer to the [MetaMask Setup Guide](https://metamask.io/download.html).
- You have [Ganache](https://www.trufflesuite.com/ganache) installed for local blockchain development.

## Installing BlockPermit

To install BlockPermit, follow these steps:

```bash
# Clone the repository
git clone https://github.com/BlokPermit/BlockPermit.git

# Navigate to the project directory
cd block-permit-dapp

# Install the dependencies
npm install
```
To develop with a local blockchain, you also need to clone and setup the local Ganache environment:

```bash
# Clone the blockchain repository
git clone https://github.com/BlokPermit/block-permit-blockchain.git

# Navigate to the blockchain directory
cd block-permit-blockchain

# Run local Ganache
npm run localganache
```

### Environment variables
In order to run this project, you will need to create and add the following environment variables to your .env.local file:
```dotenv
APP_DOMAIN=block.permit
NEXTAUTH_URL=http://localhost:3000
PROVIDER_URL=HTTP://127.0.0.1:8545
OWNER_CONTRACT_ADDRESS=0x1e26219666121025C07CF50d6cd8963C6F93190d
MORALIS_API_KEY=""
NEXTAUTH_SECRET=""
DATABASE_URL=""
NEXT_PUBLIC_SUPABASE_PROJECT_URL=""
NEXT_PUBLIC_SUPABASE_PROJECT_ANON_KEY=""
```

Replace the values with your actual keys and URLs where needed.

## Using BlockPermit

To use BlockPermit, follow these steps:

1. Start the development server:
```bash
npm run dev
```
2. Open http://localhost:3000 with your browser. The page will automatically reload if you make changes to the code.
3. You will be asked to connect with your MetaMask wallet for authentication.
4. You're ready to start managing your projects on the blockchain!


***

Made with :heart: by BlockPermit
