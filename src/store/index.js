import { combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import sessionStorage from 'redux-persist/lib/storage/session';
import commonReducer from '../service/common/reducer';
import carReducer from '../service/car/reducer';
import activityReducer from '../service/activities/reducer';
import packageReducer from '../service/package/reducer';
import hotelReducer from '../service/hotel/reducer';
import { reducer as reduxForm } from 'redux-form';
import loginReducer from '../service/login/reducer';
import addcartReducer from '../service/addCart/reducer';
import dashboardReducer from '../service/dashboard/reducer';
import cardReducer from "../service/card/reducer";
import paymentReducer from '../service/payment/reducer';
import loaderReducer from '../service/loader/reducer';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import subscriptionReducer from '../service/subscription/reducer';
import transferReducer from '../service/transfer/reducer';

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  //stateReconciler: hardSet,

   stateReconciler: autoMergeLevel2,
  //migrate: createMigrate(migrations, { debug: true })
  //whitelist: ["paymentDetails"]

}

// import storage from 'redux-persist/lib/storage';
// import { SetTransform } from './transforms'

const rootReducer = combineReducers({
  commonReducer,
  loaderReducer,
  hotelReducer,
  carReducer,
  activityReducer,
  packageReducer,
  form: reduxForm,
  addcartReducer,
  loginReducer: loginReducer,
  dashboardReducer: persistReducer(persistConfig, dashboardReducer),
  cardReducer,
  paymentReducer: persistReducer(persistConfig, paymentReducer),
  subscriptionReducer:subscriptionReducer,
  transferReducer
});



export default rootReducer;