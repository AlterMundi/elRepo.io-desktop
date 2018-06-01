import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';

const { ipcRenderer } = window.require("electron");

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [sagaMiddleware, routeMiddleware];

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
);

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  enhancer
);

//Listen electorn ipcMain
if (typeof ipcRenderer !== 'undefined')
  ipcRenderer.on('api-reply',(event, args) => store.dispatch(args))


sagaMiddleware.run(rootSaga);

store.dispatch({type:'CONNECT'})

export { store, history };
