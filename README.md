# Agua Torito Fresh — Landing estática (GitHub Pages)

Landing 100% estática en **HTML + CSS + JS vanilla**. Sin Node, sin servidor, sin backend. Solo `WhatsApp` para pedidos.

## Estructura
```
/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── logo.jpg
│   ├── bidon.jpg
│   └── torito.jpg
└── README.md
```

## Configurar WhatsApp
Edita `js/script.js:4`:

```js
whatsappNumber: "51999999999" // sin + ni espacios
```

Cambia teléfonos/horario/zona directamente en `index.html` (footer) y precios en las 3 tarjetas de `#productos`.

## Probar local (sin servidor)
Doble clic en `index.html` funciona. Para rutas relativas 100% fiel a GitHub Pages:

```bash
python3 -m http.server --directory . 8000
# abre http://localhost:8000
```

## Publicar GRATIS en GitHub Pages (2 minutos)

1. Crea repositorio en GitHub (ej. `torito-landing`).
2. Sube los archivos (arrastra o `git push`):
   ```bash
   git init
   git add .
   git commit -m "landing torito fresh"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
3. En GitHub: `Settings` → `Pages`.
4. `Build and deployment` → `Source: Deploy from a branch`.
5. `Branch: main` + `Folder: / (root)` → `Save`.
6. Espera 1-2 min. Tu URL será `https://TU_USUARIO.github.io/TU_REPO/`.

> Funciona tanto en `usuario.github.io` (raíz) como en `usuario.github.io/nombre-repo` porque usa rutas relativas `./css/style.css`.

## Personalizar
- Colores: edita `:root` en `css/style.css:2`
- Productos: duplica un `<article class="card">` en `index.html`
- Imágenes: reemplaza archivos en `assets/` manteniendo el nombre, o actualiza `src="./assets/..."`

## Requisitos cumplidos
- Solo HTML/CSS/JS + imágenes locales
- Sin servidor, sin Node en producción, sin backend, sin DB, sin APIs, sin auth, sin cookies, sin tracking
- Title SEO: `Agua Torito Fresh | Agua en bidones a domicilio`
- Accesible, rápido, semántico
- Pedido final vía `https://wa.me/NUMERO?text=...`
