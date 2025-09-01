# Usage help function
usage() {
    echo "Usage: $0 [dev|prod]"
    echo "  dev   Run in development mode"
    echo "  prod  Run in production mode"
    echo "  -h, --help  Show this help message"
}

# Show help if -h or --help is passed, or if no arguments
if [[ "$1" == "-h" || "$1" == "--help" || -z "$1" ]]; then
    usage
    exit 0
fi

if [[ "$1" == "dev" ]]; then
    PROFILE="dev"
elif [[ "$1" == "prod" ]]; then
    PROFILE="prod"
else
    usage
    exit 1
fi

docker compose --profile "$PROFILE" build
docker compose --profile "$PROFILE" up -d --remove-orphans