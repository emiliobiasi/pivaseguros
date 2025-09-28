# 🏢 Piva Seguros - Enterprise Insurance Management Platform

<div align="center">

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PocketBase](https://img.shields.io/badge/pocketbase-%23B95B3B.svg?style=for-the-badge&logo=pocketbase&logoColor=white)

_A comprehensive, enterprise-grade insurance management platform built with modern web technologies_

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Developers](#-developers)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [UI Components](#-ui-components)
- [Data Models](#-data-models)
- [Form Validation](#-form-validation)
- [State Management](#-state-management)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 About

**Piva Seguros** is a sophisticated insurance management platform designed to streamline the entire insurance lifecycle, from policy applications to claims processing. Built with React 18, TypeScript, and modern web standards, it provides a robust foundation for handling multiple insurance product lines including residential surety bonds, commercial surety bonds, fire insurance, and capitalization bonds.

The platform features a comprehensive multi-step form system with real-time validation, dynamic field population via CEP lookup, and seamless integration with backend services for data persistence and retrieval.

## ✨ Features

### 🏠 **Residential Insurance Management**

- **Residential Surety Bonds**: Complete application forms with multi-tenant support
- **Property Details Management**: Address validation with automatic CEP lookup
- **Tenant Information Processing**: Support for primary and secondary applicants
- **Spouse Integration**: Automatic spouse data collection for married applicants

### 🏢 **Commercial Insurance Solutions**

- **Commercial Surety Bonds**:
  - Companies with CNPJ less than 2 years
  - Established companies with CNPJ more than 2 years
- **Commercial Fire Insurance**: Comprehensive coverage options
- **Property Usage Classification**: Residential, commercial entrepreneur, and corporate classifications

### 🔥 **Fire Insurance Products**

- **Residential Fire Insurance**: Coverage for homes and apartments
- **Commercial Fire Insurance**: Business property protection
- **Coverage Options**:
  - Basic free plans
  - Intermediate coverage
  - Premium referral network plans

### 💰 **Capitalization Bonds**

- **Investment Products**: Capitalization bond management
- **Term Options**: Flexible investment periods
- **Payment Plans**: Multiple payment scheduling options

### 📊 **Advanced Form Management**

- **Multi-Step Forms**: Intuitive wizard-style interfaces
- **Real-time Validation**: Client-side and server-side validation
- **Dynamic Field Population**: Automatic address completion via CEP API
- **Conditional Logic**: Smart form sections based on user selections
- **File Upload Support**: Document attachment capabilities

### 🏢 **Real Estate Agency Integration**

- **Agency Registration**: Complete real estate agency onboarding
- **Agent Management**: Support for multiple agents per agency
- **Commission Tracking**: Built-in commission calculation system

### 💳 **Billing & Payments**

- **Boleto Generation**: Brazilian payment slip creation
- **Payment History**: Comprehensive transaction tracking
- **Download Center**: Easy access to payment documents

### 📈 **Analytics & Reporting**

- **Interactive Charts**: Horizontal bar charts and pie charts using Recharts
- **Data Visualization**: Real-time insurance portfolio insights
- **Performance Metrics**: Key performance indicators dashboard

### 🎨 **Modern UI/UX**

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant components
- **Component Library**: Radix UI integration for consistent design
- **Animation Support**: Framer Motion for smooth transitions

## 🛠 Tech Stack

### **Frontend Framework**

- **React 18.3.1** - Latest React with concurrent features
- **TypeScript 5.x** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server

### **Styling & UI**

- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful icon library
- **React Icons** - Comprehensive icon collection
- **Framer Motion** - Production-ready motion library

### **State Management & Data**

- **React Context API** - Built-in state management
- **PocketBase** - Backend-as-a-Service with real-time capabilities
- **Axios** - HTTP client for API communications
- **React Router Dom** - Client-side routing

### **Form Management**

- **React Hook Form** - Performant forms with minimal re-renders
- **React Dropzone** - Drag-and-drop file uploads
- **React Currency Input Field** - Currency formatting
- **React Day Picker** - Date selection components

### **Data Visualization**

- **Recharts 2.x** - Composable charting library
- **Canvas Confetti** - Celebration animations

### **Development Tools**

- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **TypeScript Compiler** - Type checking and compilation

### **Utilities**

- **clsx/classnames** - Conditional className utilities
- **date-fns** - Modern date utility library
- **cmdk** - Command palette interface
- **sonner** - Toast notifications

## 🏗 Architecture

### **Component Architecture**

The application follows a modular component architecture with clear separation of concerns:

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, inputs, etc.)
│   ├── forms/           # Form-specific components
│   ├── tables/          # Data table components
│   └── modals/          # Modal dialog components
├── contexts/            # React Context providers
├── screens/             # Page-level components
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and helpers
└── routes/              # Application routing configuration
```

### **Data Flow**

1. **User Interaction** → Component
2. **Component** → Context/Service
3. **Service** → PocketBase API
4. **API Response** → Component State
5. **State Update** → UI Re-render

### **State Management Strategy**

- **Local State**: Component-level state with useState/useReducer
- **Global State**: Context API for shared application state
- **Server State**: PocketBase real-time subscriptions
- **Form State**: React Hook Form for complex form management

## 📁 Project Structure

```
pivaseguros/
├── public/                          # Static assets
│   └── placeholder.svg             # Default images
├── src/
│   ├── assets/                     # Application assets
│   │   ├── favicon.ico
│   │   ├── logo.png
│   │   └── notificacao_som.mp3
│   ├── components/                 # React components
│   │   ├── ui/                     # Base UI components
│   │   ├── *FormCard/              # Form components
│   │   ├── *Table/                 # Table components
│   │   ├── *Modal/                 # Modal components
│   │   └── [individual components]
│   ├── contexts/                   # React contexts
│   │   ├── auth/                   # Authentication context
│   │   └── boletos/                # Billing context
│   ├── screens/                    # Page components
│   ├── types/                      # TypeScript definitions
│   ├── utils/                      # Utility functions
│   │   ├── api/                    # API service functions
│   │   ├── regex/                  # Input formatting
│   │   └── backend/                # Backend configuration
│   └── routes/                     # Application routing
├── data/                           # Static data files
│   ├── insurance-rules.ts          # Business rules
│   └── real-estate.ts              # Real estate data
├── components.json                 # UI component configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── vite.config.ts                 # Vite configuration
└── vercel.json                    # Deployment configuration
```

## 🌐 API Integration

### **PocketBase Integration**

The application integrates with PocketBase for backend services, providing a lightweight and real-time database solution.

### **Real-time Updates**

- **Live Data Sync**: Real-time database subscriptions
- **Instant Notifications**: Push notifications for status changes
- **Collaborative Editing**: Multi-user form editing support

### **External APIs**

- **CEP Lookup**: Brazilian postal code validation and address completion
- **Document Generation**: PDF generation for insurance documents
- **Payment Processing**: Integration with Brazilian payment systems

## 🎨 UI Components

### **Design System**

Built on Radix UI primitives with custom styling:

- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Forms**: Input fields, selects, checkboxes, radio buttons
- **Data Display**: Tables, cards, badges, progress indicators
- **Navigation**: Tabs, breadcrumbs, pagination
- **Feedback**: Alerts, toasts, loading states, modals

### **Responsive Design**

- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid and Flexbox layouts
- **Typography**: Responsive font scaling
- **Accessibility**: ARIA roles and attributes for screen readers

## ✅ Form Validation

### **Validation Strategy**

- **Client-side**: Immediate feedback with React Hook Form
- **Server-side**: Backend validation with PocketBase
- **Custom Validators**: Brazilian-specific validations (CPF, CNPJ, CEP)

### **Input Formatting**

```typescript
// Example: CPF formatting
const formatCPF = (value: string): string => {
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}
```

### **Validation Rules**

- **Required Fields**: Marked with red asterisk (\*)
- **Format Validation**: Email, phone, document numbers
- **Business Logic**: Age restrictions, income requirements
- **Cross-field Validation**: Dependent field validation

## 🔄 State Management

### **Context Providers**

```typescript
// Authentication Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
})

// Billing Context
const BoletosContext = createContext<BoletosContextType>({
  boletos: [],
  fetchBoletos: () => {},
  downloadBoleto: () => {},
})
```

### **Custom Hooks**

- **useAuth**: Authentication state management
- **useBoletos**: Billing and payment management
- **useForm**: Form state and validation
- **useApi**: API request handling

## 🚀 Deployment

### **Hostinger Deployment**

The application is optimized for Hostinger deployment:

### **Performance Optimization**

- **Code Splitting**: Dynamic imports for route-based splitting
- **Asset Optimization**: Image compression and lazy loading
- **Bundle Analysis**: Webpack bundle analyzer integration
- **CDN Integration**: Static asset delivery optimization

---

## 👨‍💻 Developers

This project was built with dedication and expertise by:

<div align="center">

### **Emílio Biasi**

[![Website](https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://emiliobiasi.com/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/emiliobiasi)

### **Giovanni Cruz**

[![Website](https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://crzweb.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/euCRUZ)

</div>

---

<div align="center">

**Built with ❤️ by Emílio Biasi & Giovanni Cruz**

_Empowering insurance management through modern technology_

</div>
