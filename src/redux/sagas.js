import { all, fork } from 'redux-saga/effects';
import { loadChannels, runState, manageRunState, tryPassword, sendRequest, queryLocations, loadLocations, createAccount, loginAccount, listenPassword, sendPassword, manageAuth } from './api/sagas'

export default function* rootSaga(getState) {
  yield all([
    fork(sendRequest),
    fork(queryLocations),
    fork(loadLocations),
    fork(createAccount),
    fork(loginAccount),
    fork(listenPassword),
    fork(sendPassword),
    fork(manageAuth),
    fork(tryPassword),
    fork(runState),
    fork(manageRunState),
    fork(loadChannels)
  ]);
}
