import React from 'react'
import ReactDom from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import StoreContextProvider from './components/context/StoreContextProvider.jsx'

// Find <div id="root"> in index.html and mount app inside it
ReactDom.createRoot(document.getElementById('root')).render(
  // routing
  <BrowserRouter>
  // Makes global state
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
   
  </BrowserRouter>
    
 
)
