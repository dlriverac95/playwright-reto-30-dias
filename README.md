# Reto de 30 Días de Automatización con Playwright 🚀

[![Playwright Tests](https://github.com/dlriverac95/playwright-reto-30-dias/actions/workflows/playwright.yml/badge.svg)](https://github.com/dlriverac95/playwright-reto-30-dias/actions)
[![Playwright Version](https://img.shields.io/badge/playwright-v1.49+-green.svg?logo=playwright)](https://playwright.dev/)
[![Language](https://img.shields.io/badge/language-TypeScript-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Apache--2.0-yellow.svg)](LICENSE)

Este repositorio contiene mi solución y progreso para el **Reto de 30 Días de Automatización**, enfocado en la creación de pruebas de extremo a extremo (E2E) robustas, escalables y profesionales. El sitio web objetivo bajo prueba es la plataforma demo [OrangeHRM](https://opensource-demo.orangehrmlive.com/).

El enfoque principal de este proyecto es ir más allá de los scripts básicos de automatización, implementando patrones de diseño arquitectónicos e integración continua (CI/CD) de nivel empresarial.

---

## 🛠️ Stack Tecnológico

* **Core Engine:** [Playwright](https://playwright.dev/)
* **Lenguaje de Programación:** [TypeScript](https://www.typescriptlang.org/)
* **Entorno de Ejecución:** Node.js (LTS)
* **Pipeline de CI/CD:** GitHub Actions

---

## 📐 Arquitectura del Proyecto

El proyecto está estructurado siguiendo las mejores prácticas de la industria para mantener la mantenibilidad, escalabilidad y legibilidad del código:

```text
playwright-reto-30-dias/
├── .auth/                  # Almacenamiento seguro de estados de sesión (Cookies/LocalStorage)
├── .github/workflows/      # Pipelines de Integración Continua (GitHub Actions)
├── components/             # Elementos y fragmentos de UI reutilizables (Navbar, SidePanel, etc.)
├── config/                 # Manejo estricto de configuraciones y variables de entorno
├── models/                 # Modelos de datos e interfaces TypeScript
├── pageobjects/            # Clases bajo el patrón Page Object Model (POM)
├── tests/                  # Estructura organizada de suites de pruebas
│   ├── auth.setup.ts       # Configuración global para autenticación inicial
│   ├── admin/              # Pruebas internas que requieren sesión pre-cargada
│   └── public/             # Pruebas que requieren un entorno/navegador 100% limpio
└── playwright.config.ts    # Configuración maestra de Playwright

🌟 Características Avanzadas Implementadas
Page Object Model (POM): Abstracción total de las páginas y componentes de la interfaz de usuario para reducir la duplicación de código y simplificar el mantenimiento ante cambios en la UI.

Global Authentication Setup (storageState): Optimización del rendimiento web. El sistema realiza el Login una única vez (Fase de Setup), guarda el estado en un archivo JSON local y lo inyecta automáticamente en las pruebas del módulo admin, evitando inicios de sesión repetitivos.

Aislamiento de Sesión: Separación inteligente en carpetas. Las pruebas de login (tests/public/) corren de manera totalmente aislada en navegadores limpios para validar flujos negativos (credenciales inválidas, campos requeridos), mientras que el core funcional aprovecha la sesión pre-guardada.

Validación Estricta de Entorno: Uso de un wrapper estricto (Environment.ts) para garantizar que el framework nunca intente ejecutarse si falta una variable de entorno crucial.

🚀 Configuración Local y Ejecución
Prerrequisitos
Node.js (Versión LTS recomendada)

Instalar Git

1. Clonar el repositorio e instalar dependencias
Bash
git clone [https://github.com/dlriverac95/playwright-reto-30-dias.git](https://github.com/dlriverac95/playwright-reto-30-dias.git)
cd playwright-reto-30-dias
npm install
npx playwright install --with-deps
2. Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto basándote en las credenciales de OrangeHRM:

Code snippet
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=admin123
ESS_USERNAME=empleado_ficticio
ESS_PASSWORD=clave_ficticia
3. Comandos de Ejecución
Ejecutar todas las pruebas (Flujo Completo Inteligente):

Bash
npx playwright test
Esto disparará primero el setup de autenticación, luego las pruebas con sesión en admin y por último las pruebas públicas multi-navegador.

Ejecutar un proyecto específico (ej. Pruebas de Administrador con sesión):

Bash
npx playwright test --project="admin"
Ejecutar con Interfaz Gráfica (Headed / UI Mode):

Bash
npx playwright test --ui
🤖 Integración Continua (CI/CD)
El repositorio cuenta con un pipeline automatizado en GitHub Actions (playwright.yml). Cada vez que se realiza un push o un pull request en las ramas main o master, el servidor de CI ejecuta los siguientes pasos en una máquina virtual de Linux:

Levanta un entorno aislado con Ubuntu.

Instala la versión de Node.js requerida y descarga las dependencias con npm ci.

Descarga de forma optimizada los binarios de los navegadores necesarios.

Inyección de Secretos: Mapea de forma segura los GitHub Repository Secrets para que la suite de pruebas verifique las credenciales sin exponer datos sensibles.

Ejecuta la suite completa en modo headless.

Almacena automáticamente los reportes de Playwright como artefactos descargables durante 30 días si llega a ocurrir algún fallo.

Variables Secretas Requeridas en GitHub
Para que el pipeline de Actions funcione correctamente, se deben agregar los siguientes secretos en Settings > Secrets and variables > Actions:

ADMIN_USERNAME

ADMIN_PASSWORD

ESS_USERNAME

ESS_PASSWORD

📝 Licencia
Este proyecto está bajo la Licencia Apache-2.0 - mira el archivo LICENSE para más detalles.

Este proyecto es parte de mi crecimiento profesional como Quality Assurance Automation Engineeering. ¡Feedback e ideas son siempre bienvenidos! 🎯