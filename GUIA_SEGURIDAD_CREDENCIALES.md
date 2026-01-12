# 🔐 Guía de Seguridad - Credenciales y Variables de Entorno

## 🚨 Problema: Credenciales Expuestas

Los archivos JSON de credenciales de Firebase **nunca deben estar en el repositorio Git**:

```
❌ NO HACER:
- Commitear .env con valores reales
- Incluir archivos *firebase-adminsdk*.json en git
- Hardcodear credenciales en el código
- Compartir archivos JSON por email/chat

✅ HACER:
- Usar .env con .gitignore
- Usar variables de entorno en producción
- Rotar credenciales regularmente
- Usar secretos en plataformas de hosting
```

---

## 📋 Estructura de Seguridad Implementada

### 1. Archivo `.env.example` (Plantilla)
Contiene la estructura sin valores sensibles:
```bash
cat backend-hotandcold/.env.example
```
**Está en Git** ✅ - Es seguro, solo muestra estructura

### 2. Archivo `.env` (Valores Reales)
Contiene credenciales reales:
```bash
# Nunca está en Git (ignorado por .gitignore)
backend-hotandcold/.env
```
**Nunca está en Git** ✅ - Solo en máquinas locales

### 3. Archivo `config/firebaseAdmin.js` (Dinámico)
Lee credenciales desde `.env`:
```javascript
require('dotenv').config();
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  // ... resto de campos desde variables
};
```
**Usa variables, no archivos** ✅

---

## 🔧 Cómo Configurar Seguridad

### Paso 1: Verificar `.gitignore`
```bash
cat backend-hotandcold/.gitignore
```
Debe incluir:
```
.env
.env.local
*firebase-adminsdk*.json
```

### Paso 2: Crear archivo `.env`
```bash
# Copiar la plantilla
cp backend-hotandcold/.env.example backend-hotandcold/.env

# Editar y añadir tus valores reales
nano backend-hotandcold/.env
```

Rellenar con tus credenciales de Firebase:
```
FIREBASE_PROJECT_ID=hotandcold-nuevo
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@hotandcold-nuevo.iam.gserviceaccount.com
...
```

### Paso 3: Verificar que está ignorado
```bash
# Confirmar que .env NO está en git
git status | grep ".env"
# No debe aparecer nada

# Confirmar que está en .gitignore
git check-ignore .env
# Debe salir: .env
```

---

## 🚀 Producción - Variables de Entorno

### En Render.com (o Similar)
1. Ve a **Dashboard** → **Settings** → **Environment**
2. Añade variables:
   ```
   FIREBASE_PROJECT_ID = hotandcold-nuevo
   FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL = firebase-adminsdk-...
   ```
3. Deploy automático

### En Heroku
```bash
heroku config:set FIREBASE_PROJECT_ID=hotandcold-nuevo
heroku config:set FIREBASE_PRIVATE_KEY="-----BEGIN..."
heroku config:set FIREBASE_CLIENT_EMAIL="..."
```

### En Docker
```dockerfile
FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Variables se pasan en runtime
CMD ["node", "test-server.js"]
```
```bash
docker run -e FIREBASE_PROJECT_ID=... -e FIREBASE_PRIVATE_KEY=... image_name
```

---

## 🔄 Flujo de Credenciales

```
┌─────────────────────────────────────────────────────────────┐
│ Firebase Console                                            │
│ ├─ Project Settings                                        │
│ └─ Service Accounts > Generate New Private Key (JSON)     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                    (Descargar JSON)
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │ Tu Máquina Local (Desarrollo)        │
        │ ├─ Copia contenido del JSON         │
        │ └─ Pega en .env como variables      │
        └───────────────┬───────────────────────┘
                        │
                   (Solo local)
                        │
                        ▼
            ┌──────────────────────┐
            │ Node.js process      │
            │ require('dotenv')    │
            │ process.env.*        │
            └──────────────────────┘
                        │
                        ▼
            ┌──────────────────────┐
            │ Firebase SDK         │
            │ admin.credential     │
            │ .cert(credentials)   │
            └──────────────────────┘
                        │
                        ▼
            ┌──────────────────────┐
            │ Firestore (Nube)     │
            └──────────────────────┘
```

---

## 🛡️ Mejores Prácticas de Seguridad

### 1. Rotación de Credenciales
```bash
# Cada 3 meses:
1. Ve a Firebase Console > Service Accounts
2. Haz clic en el account > Generate New Key
3. Actualiza tu .env local y variables en producción
4. Borra la clave antigua
```

### 2. Permisos Mínimos
No uses credenciales de Owner/Admin. Crea un custom role:
```
Firebase Console > IAM > Custom Roles
Permisos mínimos necesarios:
- firestore.databases.get
- firestore.documents.create
- firestore.documents.update
- firestore.documents.delete
```

### 3. Auditoría
Revisa accesos regularmente:
```
Firebase Console > Firestore > Indexes
Google Cloud > Audit Logs
```

### 4. Backup Seguro
```bash
# Exportar datos (no credenciales)
node export-firestore.js

# El backup NO debe incluir credenciales
cat data-backup.json | grep -i "private_key"
# No debe salir nada
```

---

## ⚠️ Qué Hacer Si las Credenciales se Exponen

1. **INMEDIATAMENTE:**
   ```bash
   # Ve a Firebase Console
   # Service Accounts > Borra la clave comprometida
   # Genera una nueva clave
   ```

2. **Actualiza credenciales:**
   ```bash
   # Actualiza .env y variables de producción
   # Reinicia servidor en producción
   ```

3. **Limpia historial Git:**
   ```bash
   # Si ya está en git, usar git-filter-branch o BFG
   git filter-branch --tree-filter 'rm -f .env' HEAD
   git push origin --force --all
   ```

---

## ✅ Checklist de Seguridad

- [ ] `.env` está en `.gitignore`
- [ ] `.env.example` está en Git (sin valores sensibles)
- [ ] `config/firebaseAdmin.js` usa `process.env`
- [ ] Archivos `*firebase-adminsdk*.json` están en `.gitignore`
- [ ] `.env` nunca se ha hecho commit (verificar histórico)
- [ ] Variables de entorno están configuradas en producción
- [ ] Credenciales se rotan regularmente (cada 3 meses)
- [ ] Accesos se auditan periódicamente

---

## 📚 Archivos Relevantes

```
backend-hotandcold/
├── .env                          # Credenciales reales (local, ignorado)
├── .env.example                  # Plantilla (en Git)
├── .gitignore                    # Excluye .env y JSONs
├── config/
│   └── firebaseAdmin.js         # Lee desde .env
└── test-server.js               # Usa credenciales via process.env
```

---

**Última actualización**: 12/01/2026
**Estado**: ✅ Sistema seguro con variables de entorno
