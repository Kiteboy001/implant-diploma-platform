FROM python:3.11-slim-bookworm

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl ca-certificates build-essential && \
    rm -rf /var/lib/apt/lists/*

# Install Hermes Agent
RUN curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# Find the actual install location
RUN HERMES_DIR=$(ls -d /root/.hermes/hermes-agent* 2>/dev/null | head -1) && \
    echo "Hermes installed at: $HERMES_DIR"

# Install additional Python deps for Neon/Postgres access
RUN pip install psycopg2-binary

# Copy implant diploma coach skill into the profile
COPY implant-diploma-coach/ /root/.hermes/skills/implant-diploma-coach/
COPY SOUL.md /root/.hermes/SOUL.md

# Copy startup script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# The API server runs on 8642
EXPOSE 8642

ENV HERMES_HOME=/root/.hermes
ENV HOME=/root

ENTRYPOINT ["/entrypoint.sh"]
