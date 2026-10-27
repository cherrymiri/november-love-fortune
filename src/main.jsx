import React from 'react';
import { createRoot } from 'react-dom/client';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './styles/base.css';
import './styles/card.css';
import './styles/main.css';
import './styles/result.css';
import './styles/invite.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
