@echo off
set NODE_SCRIPT=%~dp0db_backup.js
set DB_NAME="db_gestaoprodutosvendas"
cd %NODE_SCRIPT%
node -e "import('./db_backup.js').then(mod => mod.default('%DB_NAME%'));"
 