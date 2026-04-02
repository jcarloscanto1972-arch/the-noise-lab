# The Noise Lab — Sitio Web

Sitio web para DJ / Productor / Organizador de Eventos.

## Estructura

```
the-noise-lab/
├── index.html        # Inicio
├── about.html        # Sobre mí
├── music.html        # Música
├── events.html       # Eventos
├── gallery.html      # Galería
├── booking.html      # Reservas
├── css/
│   └── styles.css    # Estilos globales
├── js/
│   └── script.js     # JavaScript global
└── README.md
```

## Cómo correr localmente

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Luego abre `http://localhost:8000` en tu navegador.

## Agregar imagen o video al hero

En `index.html`, busca el comentario `<!-- IMAGEN -->` o `<!-- VIDEO -->` y reemplaza el placeholder:

```html
<!-- IMAGEN -->
<img src="foto.jpg" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">

<!-- VIDEO -->
<video src="clip.mp4" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;border-radius:inherit"></video>
```

## Deploy en GitHub Pages

1. Sube el repositorio a GitHub
2. Ve a **Settings → Pages**
3. Selecciona **Branch: main**, carpeta **/ (root)**
4. Tu sitio estará en `https://tu-usuario.github.io/the-noise-lab`
