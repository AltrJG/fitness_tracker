# 🏋️‍♀️ Fitness Tracker 🏃‍♂️

**Fitness Tracker** es una herramienta interactiva que permite a los usuarios organizar y calcular el gasto calórico aproximado de sus ejercicios diarios, establecer metas semanales y visualizar su progreso de forma atractiva y detallada.

## 🚀 Funcionalidades Principales
### 🗓️ Gestión de Ejercicios por Día
- **Selecciona un día** de la semana para registrar tus ejercicios.
- **Ingresa tu peso**, el tipo de ejercicio y la duración (en minutos).
- Calcula **calorías quemadas por ejercicio** utilizando valores MET.

### ✏️ Edición Flexible
- Edita y actualiza fácilmente los datos de cada día de la semana.

### 📊 Resumen Semanal
- Visualiza el **total de calorías quemadas en la semana**.
- Gráfico de pastel que muestra la distribución calórica por ejercicio.

### 🎯 Establece Metas
- Define una **meta de calorías semanales**.
- Visualiza tu progreso con una barra dinámica y porcentaje completado.
- Muestra las **calorías restantes** para alcanzar tu objetivo.

## 🛠️ Tecnologías Utilizadas
- **Vite + React (TSX)**: Desarrollo rápido y modular.
- **TailwindCSS**: Estilización moderna y responsiva.
- **Firebase**: Almacenamiento y manejo de datos.

## 📦 Instalación y Uso

### 1️⃣ Instalar Dependencias
Asegúrate de tener [Node.js](https://nodejs.org/) instalado, luego ejecuta:  
```bash
npm install
```

### 2️⃣ Configurar Firebase
Actualiza el archivo `src/lib/firebase.ts` con las credenciales de tu base de datos Firebase. Aquí tienes un ejemplo:  
```javascript
const firebaseConfig = {
  apiKey: " Your API Key ",
  authDomain: " Your Auth Domain ",
  projectId: " Your Project ID ",
  storageBucket: " Your Storage Bucket ",
  messagingSenderId: " Your Messaging Sender ID ",
  appId: " Your App ID ",
};
```

### 3️⃣ Ejecutar el Proyecto Localmente
Inicia el servidor de desarrollo con:  
```bash
npm run dev
```