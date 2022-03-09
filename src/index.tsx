import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import qs from "query-string";

import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css"
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css"
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css"
import "bpmn-js/dist/assets/diagram-js.css"
import "bpmn-js-embedded-comments/assets/comments.css";

import {AppType, createAppContextProvider} from "./AppContext";

type ParsedSearchType = {
  applicationType: string
};
const parsedSearch = qs.parse(window.location.search) as unknown as ParsedSearchType;
if (!parsedSearch.applicationType) parsedSearch.applicationType = "viewer";

// TODO: validate AppType before passing it here
const AppProvider = createAppContextProvider(parsedSearch.applicationType as AppType);

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

