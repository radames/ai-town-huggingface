# AI Town 🏠💻💌 on Hugging Face 🤗

[**Demo on Hugging Face Spaces**](https://huggingface.co/spaces/radames/ai-town)

AI Town is a very cool project by [Yoko](https://github.com/ykhli) et [al.](https://github.com/a16z-infra/ai-town), a virtual town with live AI characters where they can chat and socialize. You can also interact with them by sending them messages.

This repository contains a few code patches to make AI Town run on [Hugging Face 🤗 Spaces](https://huggingface.co/spaces), as well as a Dockerfile capable of running [Convex open-source backend](https://github.com/get-convex/convex-backend), the backend and frontend on a single container.

## How to run locally

Grab your Hugging Face API token from https://huggingface.co/settings/tokens

```bash
export HF_TOKEN=hf_**********
docker build -t ai-town -f Dockerfile .
docker run -ti -p 5173:5173 -e LLM_API_KEY=$HF_TOKEN ai-town
```

## How to run on Hugging Face

You can duplicate this Space https://huggingface.co/spaces/radames/ai-town?duplicate=true, add your `HF_TOKEN`
Then you can customize [constants.ts](/constants.ts) and [characters.ts](/characters.ts) as you wish, as well as the LLM model and embeddings model in [llm.ts](/llm.ts).
