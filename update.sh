#!/bin/bash
echo "--- INICIANDO PUSH A GITHUB (PATTITEXTEC) ---"
# Agrega todos los cambios (HTML, CSS, JS, imágenes)
git add .
# Crea el mensaje con la fecha y hora actual
git commit -m "Update Doryan: $(date +'%d/%m/%Y %H:%M')"
# Sube a la rama principal
git push origin main
echo "--- PROCESO TERMINADO ---"

