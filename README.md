# Subscription Service Manager

A tool to help you manage a subscription service business. This project consists of a .NET backend and a React/Vite frontend.

## Prerequisites

- [Devbox](https://github.com/jetify-com/devbox) (corepack enabled)
- [Node.js](https://nodejs.org/) 20+
- [.NET SDK](https://dotnet.microsoft.com/) 10+
- [VS Code](https://code.visualstudio.com/) (optional, for integrated tasks)

## Launching the Project

Currently, the only supported methods to run the development servers are:

### 1. Using VS Code `watch-all` Task

1. Open this workspace in VS Code.
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS).
3. Select **Tasks: Run Task**.
4. Choose **watch-all** to start both the backend and frontend in watch mode.

### 2. Using Devbox `dev` Script

If you have Devbox installed and this repo initialized, simply run:

```bash
devbox run dev
```

This will:

- Start the .NET backend in watch mode
- Start the Vite frontend server
- Automatically clean up the backend process on exit

## Other Scripts

You can also use Devbox to run other built-in scripts:

```bash
devbox run fronten       # Run frontend only
 devbox run backend      # Run backend only
 devbox run build        # Build both frontend and backend for production
 devbox run test         # Run frontend and backend tests
 devbox run clean        # Remove build artifacts and node_modules
 devbox run format       # Format code (Prettier + dotnet format)
 devbox run ci           # Emulate GitHub Actions locally with act
```

## Project Structure

```text
net_test/
├── backend/        # .NET API and services
└── frontend/       # React + Vite application
```
