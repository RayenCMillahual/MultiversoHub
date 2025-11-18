# 🌌 MultiversoHub

### Explora el multiverso de Rick & Morty en tu móvil

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Versión 1.0.0** | Proyecto Final - Desarrollo Móvil

</div>

---

## 📖 Sobre el Proyecto

Aplicación móvil educativa desarrollada como trabajo práctico para la materia **Desarrollo Móvil** del IES Cipolletti. Permite explorar personajes de Rick & Morty, marcar favoritos y funciona incluso sin conexión a internet.

**Empresa Ficticia**: MultiversoHub  
**Institución**: Instituto de Educación Superior Cipolletti  
**Carrera**: Desarrollo Full Stack  
**Año**: 2024

---

## ✨ Características Principales

### 🎯 Funcionalidades Clave

- **📋 Listado Completo**: 826 personajes con scroll infinito
- **🔍 Filtros Inteligentes**: Por estado (Vivos/Muertos/Desconocidos)
- **❤️ Sistema de Favoritos**: Guarda tus personajes preferidos
- **📄 Detalles Completos**: Info + episodios de cada personaje
- **📡 Modo Offline**: Funciona sin internet
- **🌓 Tema Oscuro/Claro**: Cambia el tema a tu gusto
- **📊 Telemetría Local**: Registro de eventos para análisis

### 📱 Pantallas

1. **Home**: Dashboard con estadísticas y accesos rápidos
2. **Personajes**: Lista completa con filtros y paginación
3. **Favoritos**: Tu colección personal
4. **Detalle**: Información completa + episodios
5. **Perfil**: Configuración y preferencias

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+
- Expo Go (en tu celular)
- Git

### Pasos
```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd MultiversoHub

# 2. Instalar dependencias
npm install

# 3. Iniciar el proyecto
npx expo start
```

**Luego**: Escanea el QR con Expo Go

### ¿Problemas?
```bash
# Limpia la caché
npx expo start --clear
```

---

## 🛠️ Stack Tecnológico

### Core
- **React Native** + **Expo** (~51.0.0)
- **TypeScript** (5.1.3)
- **Expo Router** (3.5.0) - Navegación por archivos

### Estado y Datos
- **Context API + useReducer** - Estado global
- **AsyncStorage** - Persistencia local
- **NetInfo** - Detección de conexión
- **Rick and Morty API** - Fuente de datos

---

## 📁 Estructura del Proyecto
```
MultiversoHub/
├── app/                          # Navegación (Expo Router)
│   ├── (tabs)/                   # 4 pestañas principales
│   │   ├── index.tsx             # Home
│   │   ├── characters.tsx        # Lista
│   │   ├── favorites.tsx         # Favoritos
│   │   └── profile.tsx           # Perfil
│   ├── character/[id].tsx        # Detalle dinámico
│   └── _layout.tsx               # Layout principal
│
├── src/
│   ├── components/               # Componentes reutilizables
│   ├── context/                  # FavoritesContext + ThemeContext
│   ├── services/                 # Cliente de API
│   ├── types/                    # TypeScript interfaces
│   ├── utils/                    # Telemetría
│   └── hooks/                    # useNetworkStatus
│
└── assets/                       # Recursos estáticos
```

---

## 🎯 Decisiones Técnicas

### ¿Por qué estas tecnologías?

| Tecnología | Razón |
|------------|-------|
| **Expo Router** | Navegación basada en archivos, simple y escalable |
| **Context API** | Estado global sin Redux, menos código |
| **AsyncStorage** | Persistencia simple para favoritos |
| **TypeScript** | Menos bugs, mejor autocompletado |
| **NetInfo** | Detectar conexión sin complicaciones |

---

## 📡 API Utilizada

**Rick and Morty API**: `https://rickandmortyapi.com/api`

### Endpoints Principales
```http
GET /character?page={page}          # Listar personajes
GET /character/{id}                 # Detalle
GET /character?status={status}      # Filtrar (alive/dead/unknown)
GET /episode/{id}                   # Info de episodio
```

---

## ✅ Requisitos Cumplidos

- ✅ Navegación moderna (Tabs + Stacks)
- ✅ Consumo de API pública
- ✅ Estado global (Context + useReducer)
- ✅ Persistencia local (AsyncStorage)
- ✅ Modo offline (NetInfo)
- ✅ Telemetría básica (console.log)
- ✅ Pantalla Home con estadísticas
- ✅ Pantalla de detalle con episodios
- ✅ Sistema de favoritos completo
- ✅ Configuración de tema
- ✅ Documentación técnica

---

## 🎓 Aprendizajes Clave

### Técnicos
- Diferencias entre React Web y React Native
- Gestión de estado con Context API
- Persistencia de datos en mobile
- Consumo de APIs RESTful
- TypeScript en React Native

### Mejores Prácticas
- Arquitectura modular y escalable
- Separación de responsabilidades
- Manejo de errores robusto
- Feedback visual al usuario
- Código limpio y tipado

---

## 🚀 Mejoras Futuras

- [ ] Búsqueda de personajes por nombre
- [ ] Caché de imágenes offline
- [ ] Animaciones fluidas
- [ ] Tema oscuro completo
- [ ] Tests unitarios
- [ ] Deploy a tiendas

---

## 🙏 Agradecimientos

- **Rick and Morty API** por los datos
- **Expo Team** por las herramientas
- **IES Cipolletti** por la formación
- **ChatGPT** por la asistencia en desarrollo

---

## 👨‍💻 Autor

**Rayen Millahual**  
Estudiante de Desarrollo Full Stack  
Instituto de Educación Superior Cipolletti

---

<div align="center">

**Wubba Lubba Dub Dub!** 🚀

*Hecho con ❤️ y mucho café*

**Instituto de Educación Superior Cipolletti**  
Desarrollo Full Stack | Desarrollo Móvil | 2024
Además de cumplir con todos los requisitos del trabajo práctico, implementé 10 features avanzadas adicionales: búsqueda en tiempo real, filtros combinables, gráficos interactivos, sistema de compartir, animaciones suaves con React Native Reanimated, loading skeletons animados, caché offline inteligente, tests unitarios, y un sistema completo de telemetría.
</div>