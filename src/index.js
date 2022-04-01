import React from 'react';
import * as ReactDOMClient from 'react-dom/client'
import './index.css';
import App from './App';

import moment from "moment";
import "moment/locale/nl";

moment.locale("nl");

const container=document.getElementById('root')

const root=ReactDOMClient.createRoot(container)

console.log('Koekoek!')

root.render(<App/>)
