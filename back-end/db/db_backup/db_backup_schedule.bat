@echo off
set NODE_SCRIPT=%~dp0db_backup.js
cd %NODE_SCRIPT%
node -e "import('./db_backup.js').then(mod => mod.default('db_controle_estoque'));"
 