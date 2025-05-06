import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './store/index.js';

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
	<Provider store={store}>
	<App />
	</Provider>
);
}