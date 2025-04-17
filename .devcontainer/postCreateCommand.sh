{
  "name": "Diner Portal Development",
  "dockerComposeFile": "docker-compose.yml",
  "service": "devcontainer",
  "workspaceFolder": "/workspaces/diner_portal",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-azuretools.vscode-docker",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "rebornix.ruby",
        "castwide.solargraph"
      ]
    }
  },
  "remoteUser": "vscode",
  "features": {
    "ghcr.io/devcontainers/features/common-utils:2": {
      "installZsh": true,
      "username": "vscode",
      "upgradePackages": true
    },
    "ghcr.io/devcontainers/features/node:1": {
      "version": "20"
    },
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },
  "postCreateCommand": "echo '🚀 DevContainer初期化完了！'"
}