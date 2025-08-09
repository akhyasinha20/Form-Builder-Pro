# Form Builder

A dynamic form builder application built with **React**, **Redux**, **Material-UI**, and **Vite**. This project allows users to create, preview, and submit custom forms with various field types and validations.

## Features

- **Drag & Drop Form Builder:** Easily add, remove, and reorder form fields.
- **Live Preview:** Instantly preview your form as you build it.
- **Custom Field Types:** Supports text, number, select, checkbox, radio, and more.
- **Validation:** Built-in validation for required fields and custom rules.
- **State Management:** Uses Redux for managing form state.
- **Material-UI Design:** Clean and responsive UI with Material-UI components.
- **Fast Development:** Powered by Vite for lightning-fast HMR and builds.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/form-builder.git
   cd form-builder-main/Form-builder-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Project

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to view the app.

### Building for Production

To build the project for production:

```bash
npm run build
# or
yarn build
```

The output will be in the `dist` folder.

### Preview Production Build

To locally preview the production build:

```bash
npm run preview
# or
yarn preview
```

## Folder Structure

```
Form-builder-main/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for any features, bug fixes, or suggestions.

## License

This project is licensed under the [MIT License](LICENSE).

---

Built with ❤️ using React and Vite.
