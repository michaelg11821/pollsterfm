PRISMA_BINARY="node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node"
TARGET_DIR="src/lib/prisma/client" 

mkdir -p "$TARGET_DIR"

cp "$PRISMA_BINARY" "$TARGET_DIR/"