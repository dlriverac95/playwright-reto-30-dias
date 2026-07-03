# Playwright Reto 30 Días

[![Playwright Tests](https://github.com/dlriverac95/playwright-reto-30-dias/actions/workflows/playwright.yml/badge.svg)](https://github.com/dlriverac95/playwright-reto-30-dias/actions)
[![Playwright Version](https://img.shields.io/badge/playwright-v1.49+-green.svg?logo=playwright)](https://playwright.dev/)
[![Language](https://img.shields.io/badge/language-TypeScript-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Apache--2.0-yellow.svg)](LICENSE)

Este proyecto contiene una suite de pruebas end-to-end automatizadas para la plataforma demo de OrangeHRM, desarrollada con Playwright y TypeScript. El objetivo es practicar y demostrar buenas prácticas de automatización, incluyendo Page Object Model, separación de flujos públicos y administrativos, y reutilización de sesión mediante almacenamiento de estado.

## ¿Qué incluye?

- Pruebas de login válidas y con errores de validación
- Navegación en el menú lateral y superior
- Verificación de opciones de administración y usuarios
- Creación de usuarios y validación de errores de formulario
- Reutilización de autenticación a través de un paso de setup

## Stack tecnológico

- [Playwright](https://playwright.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [dotenv](https://github.com/motdotla/dotenv)
- **Pipeline de CI/CD:** GitHub Actions

## Estructura del proyecto

```text
playwright-reto-30-dias/
├── components/           # Componentes reutilizables de la UI
├── config/               # Manejo de variables de entorno
├── models/               # Modelos de datos
├── pageobjects/          # Clases con el patrón Page Object Model
├── tests/                # Suites de pruebas
│   ├── admin/            # Pruebas que reutilizan sesión autenticada
│   ├── public/           # Pruebas públicas y de validación
│   └── auth.setup.ts     # Setup de autenticación inicial
├── playwright.config.ts  # Configuración general de Playwright
└── package.json          # Dependencias y scripts del proyecto
```

## Requisitos previos

- Node.js 18 o superior
- npm
- Navegadores de Playwright instalados

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/dlriverac95/playwright-reto-30-dias.git
   cd playwright-reto-30-dias
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Instala los navegadores de Playwright:
   ```bash
   npx playwright install
   ```

## Variables de entorno

Crea un archivo .env en la raíz del proyecto con las siguientes variables:

```env
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=admin123
ESS_USERNAME=employee
ESS_PASSWORD=employee123
```

> Los valores pueden ajustarse según el entorno o la demostración utilizada.

## Ejecución de pruebas

Ejecutar todas las pruebas:

```bash
npx playwright test
```

Ejecutar solo las pruebas de administración:

```bash
npx playwright test --project=admin
```

Ejecutar pruebas en modo interactivo:

```bash
npx playwright test --ui
```

Abrir el reporte HTML generado:

```bash
npx playwright show-report
```

## Notas

- El proyecto hace uso de almacenamiento de estado para evitar repetir el login en pruebas administrativas.
- La estructura está pensada para facilitar el mantenimiento y la escalabilidad de la suite.

## Licencia

Este proyecto se distribuye bajo la licencia ISC. Consulta el archivo LICENSE para más detalles.


Este proyecto es parte de mi crecimiento profesional como Quality Assurance Automation Engineering. ¡Feedback e ideas son siempre bienvenidos! 🎯