// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
// import { HashRouter } from 'react-router-dom';

// document.addEventListener('pyloidReady', () => {
//   createRoot(document.getElementById('root')!).render(
//     // <StrictMode>
//     <HashRouter>
//       <App />
//     </HashRouter>
//     // </StrictMode>
//   );
// });

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />
  // </StrictMode>
);
