import { all, fork } from 'redux-saga/effects';
//import { search, Identity, peerMonitor, getSlefCert, loadChannels, runState, manageRunState, tryPassword, sendRequest, queryLocations, loadLocations, createAccount, loginAccount, listenPassword, sendPassword, manageAuth } from './api/sagas'
import { joinTiers } from './api/sagas/joinTier1';
import { user, channels, peers, search} from './api/sagas-v1';
export default function* rootSaga(getState) {
  yield all([
    fork(user),
    fork(channels),
    fork(peers),
    fork(search),
    fork(joinTiers),
    /*fork(sendRequest),
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
    fork(loadChannels),
    fork(getSlefCert),
    fork(Identity),
    fork(peerMonitor),
    fork(search)*/
  ]);
}
