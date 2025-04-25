
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure the app loads properly by wrapping in a try-catch block
try {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(<App />);
  } else {
    console.error("Root element not found");
    // Create a root element if it's missing
    const newRoot = document.createElement("div");
    newRoot.id = "root";
    document.body.appendChild(newRoot);
    createRoot(newRoot).render(<App />);
  }
} catch (error) {
  console.error("Error rendering application:", error);
  // Display a helpful error message if rendering fails
  const errorDiv = document.createElement("div");
  errorDiv.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; text-align: center;">
      <h2>Application Error</h2>
      <p>Sorry, the application failed to load. Please refresh the page or try again later.</p>
      <p>Error details: ${error?.toString()}</p>
    </div>
  `;
  document.body.appendChild(errorDiv);
}
