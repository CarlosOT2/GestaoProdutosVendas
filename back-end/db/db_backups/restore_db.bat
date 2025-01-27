@echo off
set NODE_SCRIPT=%~dp0.backup_functions.js
set DB_NAME="db_gestaoprodutosvendas"
cd %NODE_SCRIPT%
node -e "import('./.backup_functions.js').then(mod => mod.restore_backup());"