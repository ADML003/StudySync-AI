# Cerebras Learning Platform

A responsive Next.js application with Tailwind CSS and ShadCN UI components featuring a modern learning platform design.

## Features

- **Responsive Design**: Mobile-first approach with responsive navigation
- **ShadCN UI Components**: Modern, accessible UI components
- **Sidebar Navigation**: Collapsible sidebar drawer for mobile devices
- **Multiple Pages**: Dashboard, Study Plan, Quiz, Analytics, and Ask Doubt sections
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **TypeScript Support**: Full TypeScript integration for type safety

## Pages

1. **Dashboard** (`/`) - Overview of learning progress with metrics and recent activity
2. **Study Plan** (`/study-plan`) - Personalized learning roadmap and goals
3. **Quiz** (`/quiz`) - Interactive quiz center with subject-wise quizzes
4. **Analytics** (`/analytics`) - Detailed learning analytics and performance metrics
5. **Ask Doubt** (`/ask-doubt`) - Question submission form with help resources

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** and visit `http://localhost:3000`

## Project Structure

```
cerebras/
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Responsive header with navigation
│   │   ├── Footer.tsx        # Footer component
│   │   ├── Layout.tsx        # Main layout wrapper
│   │   └── Navigation.tsx    # Navigation menu component
│   └── ui/
│       ├── button.tsx        # ShadCN Button component
│       └── sheet.tsx         # ShadCN Sheet component (for drawer)
├── pages/
│   ├── _app.tsx              # Main app wrapper with layout
│   ├── index.tsx             # Dashboard page
│   ├── study-plan.tsx        # Study plan page
│   ├── quiz.tsx              # Quiz center page
│   ├── analytics.tsx         # Analytics page
│   └── ask-doubt.tsx         # Ask doubt page
├── styles/
│   └── globals.css           # Global styles with Tailwind imports
├── lib/
│   └── utils.ts              # Utility functions
└── Configuration files...
```

## Key Features

### Responsive Header

- Desktop: Horizontal navigation with brand logo
- Mobile: Hamburger menu with slide-out drawer
- Active page highlighting

### Sidebar Drawer

- Mobile-friendly navigation using ShadCN Sheet component
- Smooth slide animations
- Icons for each navigation item

### Layout Components

- Consistent header, main content area, and footer
- Responsive grid layouts
- Card-based design system

## New Interactive Components

### OnboardingWizard

A multi-step wizard component that guides users through personalization:

- **Step 1**: Subject/exam selection with card grid
- **Step 2**: Proficiency level selection with radio groups
- **Step 3**: Daily study hours with interactive slider
- **Features**: Framer Motion transitions, progress dots, validation

### TodaysFocus Card

An adaptive learning card component that displays:

- Current topic with time estimates
- Animated progress bar with color coding
- Smart tips based on progress level
- Dynamic status indicators

### ConcentricRings

An animated SVG component showing learning metrics:

- Three concentric rings for Strength, Practice, Review
- Framer Motion animations on mount
- Interactive legend and overall progress summary
- Customizable colors and sizes

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **ShadCN UI** - Component library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Radix UI** - Primitive components

## Customization

The application uses CSS custom properties for theming. You can customize colors and styling by modifying:

- `styles/globals.css` - CSS variables for colors
- `tailwind.config.js` - Tailwind configuration
- `components.json` - ShadCN configuration

## Development

To add new pages or components:

1. Create new page files in the `pages/` directory
2. Add navigation items to `components/layout/Navigation.tsx`
3. Use existing ShadCN components or create new ones in `components/ui/`

## Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

The application is ready to be deployed to Vercel, Netlify, or any other hosting platform that supports Next.js.
