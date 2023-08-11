cd ..
if [ $# -eq 0 ] 
    then
    echo "No arguments supplied (expected --create OR --update OR --delete)"
fi
while test $# -gt 0
do
    case "$1" in
        --create)
            npx mikro-orm schema:create --dump > scripts/sql/create-schema.sql
            echo "npx mikro-orm schema:create >> scripts/sql/create-schema.sql"
            ;;
        --update)
            npx mikro-orm schema:update --dump > scripts/sql/update-schema.sql
            echo "npx mikro-orm schema:update >> scripts/sql/update-schema.sql"
            ;;
        --delete)
            npx mikro-orm schema:drop --dump > scripts/sql/drop-schema.sql
            echo "npx mikro-orm schema:drop >> scripts/sql/drop-schema.sql"
            ;;
    esac
    shift
done
cd scripts

echo "Press any key to exit..."
read -n 1 -s