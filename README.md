# MultiversoHub

### Una app de Rick & Morty que hice para la facu (y quedó re piola)

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**v1.0.0** | Hecho con amor (y mucho café)

</div>

---

## ¿Qué es esto?

Básicamente, es una app móvil donde podés explorar todos los personajes de Rick & Morty. 

La hice como trabajo final para la materia de Desarrollo Móvil en el IES Cipolletti. Lo que empezó como un TP simple terminó siendo una app bastante completa (creo que me zarpe un poco).

**Fun fact**: Funciona incluso sin internet. Sí, como en los viejos tiempos.

---

## ¿Qué hace?

### Las cosas básicas (que pedía el TP):
- **Ver personajes**: Los 826 que existen, con scroll infinito
- **Buscar**: Escribís "Rick" y boom, todos los Ricks
- **Favoritos**: Guardás tus personajes preferidos 
- **Detalles**: Info completa + en qué episodios aparece
- **Modo offline**: Sin wifi? No hay drama, igual funciona
- **Tema oscuro**: Porque a veces la luz lastima

### Las cosas extras (porque me copé):
- **Dashboard con gráficos**: Estadísticas re lindas con torta y todo
- **Filtros combinados**: Por estado, especie, género... lo que quieras
- **Compartir**: "Mirá este personaje" → WhatsApp, Instagram, donde sea
- **Animaciones**: Todo con movimiento suave, nada de saltos
- **Skeletons**: Mientras carga muestra placeholders animados (re pro)
- **Telemetría**: Registra qué hacés en la app (tranqui, es local)
- **Haptic feedback**: Vibra cuando tocás cosas importantes
- **Notificaciones toast**: Mensajitos lindos que aparecen abajo

---

## Capturas de Pantalla

<div align="center">
  
### Inicio
<img src="./screenshots/1-home.png" width="250" alt="Home" />

*Dashboard con estadísticas en tiempo real*

### Personajes
<img src="./screenshots/2-characters.png" width="250" alt="Lista" />

*Búsqueda + filtros que funcionan en serio*

### Detalle
<img src="./screenshots/3-detail.png" width="250" alt="Detalle" />

*Toda la info + episodios*

### Mis Favoritos
<img src="./screenshots/4-favorites.png" width="250" alt="Favs" />

*Los que guardaste para después*

### Configuración
<img src="./screenshots/5-profile.png" width="250" alt="Config" />

*Tema oscuro, datos y más*

</div>

---

## Video Demo

<div align="center">

[![Ver Demo](https://img.shields.io/badge/Ver_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=TU_VIDEO_AQUI)

*1 minuto mostrando todo lo que hace*

</div>

---

## Cómo lo usás

### Si querés probarlo:
```bash
# 1. Clonar (obvio)
git clone https://github.com/TU_USUARIO/MultiversoHub.git
cd MultiversoHub

# 2. Instalar todo
npm install

# 3. Arrancar
npx expo start

# 4. Escanear el QR con Expo Go
```

### Si algo explota:
```bash
# Probá esto primero
npx expo start --clear

# Si sigue sin andar, F
```

---

## Con qué lo hice

**Lo básico:**
- React Native (obvio)
- Expo (para no volverme loco)
- TypeScript (porque ya no puedo vivir sin)

**Para el estado:**
- Context API (nada de Redux, gracias)
- AsyncStorage (para guardar favoritos)

**Para la navegación:**
- Expo Router (rutas basadas en archivos, re simple)

**Para los datos:**
- [Rick and Morty API](https://rickandmortyapi.com/) (gratis y sin auth)

**Extras:**
- React Native Reanimated (animaciones)
- React Native Chart Kit (gráficos)
- Expo Sharing (compartir)
- Y un montón más...

---

## Cómo está organizado
```
MultiversoHub/
├── app/                    # Las pantallas
│   ├── (tabs)/            # Las 4 pestañas principales
│   └── character/[id]     # Detalle dinámico
│
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── context/           # Estado global
│   ├── services/          # La API
│   ├── types/             # TypeScript
│   └── utils/             # Helpers
│
└── assets/                # Íconos e imágenes
```

Nada del otro mundo, todo bastante standard.

---

## Lo que aprendí

### Técnico:
- React Native NO es React Web (por las malas)
- Context API es suficiente para apps medianas
- TypeScript te salva la vida
- Las animaciones hacen TODA la diferencia
- El modo offline es más fácil de lo que pensaba

### Soft skills:
- Googlear es una skill
- Leer docs > tutoriales de YouTube
- Los bugs a las 3am son los peores
- El café es fundamental

---

## Cosas que podría mejorar

Si tuviera más tiempo (o menos materias):

- [ ] Caché de imágenes (para que cargue más rápido)
- [ ] Modo oscuro en TODAS las pantallas
- [ ] Tests de verdad (tengo 2 nomas)
- [ ] Animaciones más locas
- [ ] Subir a las tiendas

---

## Decisiones técnicas (por si alguien pregunta)

**¿Por qué Expo y no React Native puro?**  
Porque mi salud mental es importante.

**¿Por qué Context API y no Redux?**  
Porque es 2024, no 2018. Y porque es más simple.

**¿Por qué TypeScript?**  
Probá trabajar sin tipado en un proyecto mediano. Te espero.

**¿Por qué esta API?**  
Es gratis, no necesita auth, está bien documentada y tiene datos piolas.

---

## Agradecimientos

- **Rick and Morty API** - Por los datos
- **Expo Team** - Por hacer React Native usable
- **Stack Overflow** - Mi verdadero profesor
- **ChatGPT** - Por bancarme las 2000 preguntas
- **Mi café** - El verdadero MVP
- **IES Cipolletti** - Por la formación

---

## Sobre mí

**Rayen Millahual**  
Estudiante de Desarrollo Full Stack  
IES Cipolletti - 2024

Si encontraste un bug o tenés sugerencias, abrí un issue. Si te gustó, dejá una estrella.

---

## Licencia

MIT o algo así. Básicamente, hacé lo que quieras con esto.

---

<div align="center">


**Hecho con:**  
Pasión  
Café  
Noches sin dormir  
VSCode  
Lo-fi beats

**Para:**  
IES Cipolletti  
Desarrollo Móvil  
Aprobar (ojalá con 10)

</div>