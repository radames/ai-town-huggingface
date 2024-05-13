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

RUN curl -L -O https://github.com/get-convex/convex-backend/releases/download/precompiled-2024-05-07-13337fd/convex-local-backend-x86_64-unknown-linux-gnu.zip && \
    unzip convex-local-backend-x86_64-unknown-linux-gnu.zip 

COPY ./llm.ts ./convex/util/
COPY ./vite.config.ts ./
COPY ./constants.ts ./music.ts ./convex/
COPY ./characters.ts ./gentle.js ./data/
COPY ./PixiStaticMap.tsx ./src/components/
COPY ./run.sh ./
CMD ["./run.sh"]