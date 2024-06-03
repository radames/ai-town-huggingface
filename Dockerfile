FROM ubuntu:22.04 as base
WORKDIR /app
ENV NODE_ENV=production

FROM base as build

RUN apt-get update -qq && \
    apt-get install -y git curl unzip wget gnupg build-essential lsb-release

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

RUN useradd -m -u 1000 user
RUN chown -R user:user /app /usr/local /tmp
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

RUN git clone https://github.com/a16z-infra/ai-town.git . && \
    git checkout f005c46d1759b47bb3ade8d41952a713c4faf331 

RUN npm install --include=dev @huggingface/inference
RUN npm install --include=dev @huggingface/hub

RUN curl -L -O https://github.com/get-convex/convex-backend/releases/download/precompiled-2024-05-07-13337fd/convex-local-backend-x86_64-unknown-linux-gnu.zip && \
    unzip convex-local-backend-x86_64-unknown-linux-gnu.zip 

COPY ./patches/llm.ts ./convex/util/
COPY ./patches/vite.config.ts ./
COPY ./patches/constants.ts ./patches/music.ts ./convex/
COPY ./patches/characters.ts ./patches/gentle.js ./data/
COPY ./patches/PixiGame.tsx ./src/components/PixiGame.tsx
COPY ./patches/PixiStaticMap.tsx ./src/components/
COPY ./patches/Button.tsx ./src/components/buttons/Button.tsx
COPY ./patches/InteractButton.tsx ./src/components/buttons/InteractButton.tsx
COPY ./patches/OAuthLogin.tsx ./src/components/buttons/OAuthLogin.tsx
COPY ./patches/App.tsx ./src/App.tsx
COPY ./patches/world.ts ./convex/world.ts
COPY ./patches/PlayerDetails.tsx ./src/components/PlayerDetails.tsx

COPY ./patches/hf.svg ./assets/hf.svg

COPY ./patches/run.sh ./

CMD ["./run.sh"]