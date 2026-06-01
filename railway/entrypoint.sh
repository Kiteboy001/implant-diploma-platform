#!/bin/bash
set -e

echo "=== Hermes Implant Diploma Agent ==="

# Wait for Hermes install to settle
HERMES_DIR=$(ls -d /root/.hermes/hermes-agent* 2>/dev/null | head -1)
echo "Hermes dir: $HERMES_DIR"

# Set API key if not already configured
if [ -n "$HERMES_API_KEY" ]; then
    echo "Configuring API key..."
    $HERMES_DIR/.venv/bin/hermes config set platforms.api_key "$HERMES_API_KEY"
fi

# Set provider/model from env vars
if [ -n "$LLM_PROVIDER" ]; then
    $HERMES_DIR/.venv/bin/hermes config set model.provider "$LLM_PROVIDER"
fi
if [ -n "$LLM_MODEL" ]; then
    $HERMES_DIR/.venv/bin/hermes config set model.default "$LLM_MODEL"
fi

# Set DATABASE_URL for the agent to access Neon
if [ -n "$DATABASE_URL" ]; then
    echo "DATABASE_URL is set (Neon connection)"
fi

# Start gateway with API server only (no messaging platforms)
echo "Starting Hermes gateway..."
exec $HERMES_DIR/.venv/bin/hermes gateway run
