@echo off
cd ..
npx mikro-orm schema:create --dump > scripts/sql/generated-schema.sql
cd scripts