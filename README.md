
# Planthia - Frontend

[![Ver Sitio en Vivo](https://img.shields.io/badge/planthia-Visitar_Sitio-black?style=for-the-badge&logo=vercel)](https://planthia.vercel.app/)

Este repositorio contiene el código fuente del frontend de Planthia, una plataforma de comercio electrónico dedicada a la venta e identificación de plantas. La aplicación está construida utilizando un enfoque moderno, responsivo y optimizado tanto para la navegación como para la conversión de usuarios.

---

## Tecnologías Utilizadas

* Framework: Next.js (App Router) para la gestión de rutas basadas en servidor y optimización del rendimiento híbrido.
* Estilos: Tailwind CSS para un diseño basado en clases de utilidad rápidas y consistentes.
* Pasarelas de Pago: Integración de doble pasarela con Mercado Pago y PayPal para procesar cobros de forma local e internacional.
* Conexión de Datos: Consumo de APIs de un CMS headless (Strapi) para el catálogo de productos y gestión de datos.

---

## Características Principales

* Autenticación Completa: Flujos de inicio de sesión, registro, recuperación y restablecimiento de contraseñas integrados directamente en la experiencia de usuario.
* Doble Pasarela de Pagos: Implementación unificada en el proceso de Checkout que permite procesar transacciones mediante Mercado Pago (utilizando Bricks de integración) y PayPal.
* Catálogo y Lista de Deseos: Navegación por la tienda con capacidades para añadir productos al carrito y gestionar una lista de favoritos (Wishlist) vinculada a la sesión del usuario.
* Gestión de Cuenta: Panel dedicado donde el usuario puede administrar su información personal y revisar el estado de sus pedidos.

---

## Estructura de Carpetas

La arquitectura del proyecto sigue las convenciones del App Router de Next.js, reflejada en la estructura de archivos visible en imagen_250.png, organizando los componentes por dominio y responsabilidad técnica:

```text
├── src/
│   ├── app/                        # Rutas y páginas de la aplicación
│   │   ├── account/                # Panel de control del usuario autenticado
│   │   ├── api/
│   │   │   └── products/
│   │   │       └── route.ts        # Handlers de rutas de API internas
│   │   ├── checkout/
│   │   │   └── page.tsx            # Formulario y proceso de pago unificado
│   │   ├── forgot-password/        # Formulario de recuperación de credenciales
│   │   ├── login/                  # Página de acceso
│   │   ├── payment-status/         # Confirmación y estado del procesamiento del pago
│   │   ├── payment-waiting/        # Pantalla intermedia de validación de transacciones
│   │   ├── register/               # Formulario de alta de nuevos usuarios
│   │   ├── set-password/           # Configuración de nueva contraseña
│   │   ├── shop/                   # Vista principal del catálogo de productos
│   │   ├── wishlist/               # Listado de productos guardados por el usuario
│   │   ├── favicon.ico
│   │   ├── globals.css             # Estilos globales y configuraciones de Tailwind
│   │   ├── layout.tsx              # Estructura base de las páginas (Navbar, Footer, etc.)
│   │   ├── not-found.tsx           # Manejo de error 404 personalizado
│   │   └── page.tsx                # Página de inicio (Landing Page)
│   ├── components/                 # Componentes interactivos organizados por módulos
│   │   ├── account/                # UI específica de la sección de perfil
│   │   ├── auth/                   # Formularios internos de inicio de sesión y registro
│   │   ├── home/                   # Bloques visuales exclusivos de la página principal
│   │   ├── layout/                 # Componentes globales de estructura
│   │   ├── products/               # Elementos del catálogo (tarjetas, grillas, detalles)
│   │   ├── shop/                   # Filtros y elementos de la interfaz de la tienda
│   │   ├── AuthModal.tsx           # Modal unificado para control de acceso de usuarios
│   │   └── PaymentBrick.tsx        # Componente de interfaz para la pasarela de Mercado Pago
│   ├── context/                    # Contextos globales de React (Carrito, Sesión)
│   ├── hooks/                      # Custom hooks para encapsular lógica reutilizable
│   └── lib/                        # Clientes de configuración y utilidades de terceros
├── .env.local                      # Archivo de variables de entorno (omitido en control de versiones)
├── .gitignore                      # Archivos y directorios excluidos de Git
└── eslint.config.mjs               # Configuración de linter para la calidad del código

````

## Configuración del Entorno Local

Para ejecutar este proyecto de forma local, es necesario configurar las variables de entorno correspondientes a los servicios externos.

### 1. Clonar el repositorio

Bash

```
git clone https://github.com/polinacodes/planthia-ecommerce-front.git

```

### 2. Instalar dependencias

Bash

```
npm install

```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz de la carpeta `frontend/` y añade los siguientes parámetros con tus credenciales de desarrollo correspondientes:

Fragmento de código

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=tu_strapi_api_token_aqui
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_mercadopago_public_key_aqui
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_paypal_client_id_aqui

```

### 4. Iniciar el servidor de desarrollo

Bash

```
npm run dev

```

El servidor web se levantará en http://localhost:3000.

## Entorno de Pruebas (Sandbox) y Credenciales de Checkout

Para validar y probar el correcto funcionamiento del flujo de pagos en el Checkout sin incurrir en transacciones reales, se habilitaron entornos de prueba con las siguientes cuentas de testing:

### Sandbox de PayPal

Utilizar estas credenciales al redirigir al flujo de autorización de PayPal:

-   Email: sb-43jary50858676@personal.example.com
    
-   Password: Zr!w.03s
    

### Sandbox de Mercado Pago

Utilizar estas credenciales de usuario de prueba dentro del formulario de procesamiento integrado:

-   Usuario: TESTUSER2694367433021786755
    
-   Contraseña: TwzLubQkhj
    
-   Código de verificación: 995141



##  Contacto

Si tenés alguna duda sobre el proyecto o simplemente querés charlar sobre desarrollo, ¡no dudes en escribirme!

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/polinacodes/)   [![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=astro&logoColor=white)](https://polinacodes.dev/)

**Polinacodes** - Full Stack Developer 