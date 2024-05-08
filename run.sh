#!/bin/bash
run_convex_command() {
    npx convex "$@" --admin-key 0135d8598650f8f5cb0f30c34ec2e2bb62793bc28717c8eb6fb577996d50be5f4281b59181095065c5d0f86a2c31ddbe9b597ec62b47ded69782cd --url "http://0.0.0.0:3210"
}

./convex-local-backend &
run_convex_command env set LLM_API_KEY $LLM_API_KEY &
run_convex_command dev --run init --until-success &
run_convex_command deploy &

# run_convex_command dev --run init --until-success &
# run_convex_command dev --tail-logs &
npm run dev:frontend -- --host 0.0.0.0 &
run_convex_command dev
