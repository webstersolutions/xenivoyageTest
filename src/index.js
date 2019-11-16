import React from 'react';
import ReactDOM from 'react-dom';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../src/store';
import App from './view/App';
import * as serviceWorker from './serviceWorker';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ErrorBoundary from './view/ErrorBoundary'
const composeEnhancers = composeWithDevTools || compose;
const store = composeEnhancers(applyMiddleware(thunk))(createStore)(rootReducer);
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <DragDropContextProvider backend={HTML5Backend}>
        <ErrorBoundary>
        <App />
        </ErrorBoundary>
        </DragDropContextProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
