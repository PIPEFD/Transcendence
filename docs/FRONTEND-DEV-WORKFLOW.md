# Frontend Development Workflow

## Quick Start

```bash
make frontend-sync
Ctrl+Shift+R
```

That's it! Your changes are live.

## How It Works

1. **Edit** your code in `frontend/src/`
2. **Run**: `make frontend-sync`
3. **Refresh**: `Ctrl+Shift+R` in your browser

## Commands

```bash
make frontend-sync       # Compile and sync changes
make frontend-logs       # Watch compilation logs
make frontend-watch      # Watch mode (auto-compile)
make frontend-purge      # Clean cache and rebuild
```

## Architecture

The workflow uses:
- **Docker volumes** to sync source code live
- **TypeScript compiler** for `.ts` → `.js`
- **Tailwind CSS** for styling
- **Browser cache clearing** for instant updates
