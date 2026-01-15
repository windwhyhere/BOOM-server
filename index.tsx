// @google/genai guidelines: This is a React entry point.
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * Fix index.tsx errors:
 * - Removed Vue-router and Pinia as the application uses React views with its own state management.
 * - Replaced Vue's createApp with React's createRoot.
 */
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}