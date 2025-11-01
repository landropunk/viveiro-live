# Comandos para subir al nuevo repositorio

## 1. Primero, crea el repositorio en GitHub:

Ve a: https://github.com/new

- Repository name: `Meteo-Historicos-Viveiro`
- Description: `Aplicación web de meteorología para Viveiro (Lugo) con datos históricos de estaciones meteorológicas`
- Public ✅
- NO añadir README, .gitignore ni license

## 2. Luego ejecuta estos comandos:

```bash
# Cambiar al nuevo repositorio
cd "c:\Users\landr\Web\Proyecto1\Meteo-Historicos-Viveiro"

# Cambiar el remote origin
git remote remove origin
git remote add origin https://github.com/landropunk/Meteo-Historicos-Viveiro.git

# Verificar
git remote -v

# Push al nuevo repositorio
git push -u origin main
```

## 3. Verificar

Después del push, ve a:
https://github.com/landropunk/Meteo-Historicos-Viveiro

¡Y listo! Tu proyecto estará en el nuevo repositorio.
