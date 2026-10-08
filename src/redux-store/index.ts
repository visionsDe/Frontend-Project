// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import categoriesListReducer from '@/redux-store/slices/categories'
import userProfileReducer from './slices/profile'
import countriesListReducer from '@/redux-store/slices/countries'
import languagesListReducer from '@/redux-store/slices/languages'
import documentTypesReducer from '@/redux-store/slices/documentTypes'
import userListingReducer from './slices/users'
import emailTemplateReducer from './slices/emailTemplates'
import bookingsReducer from './slices/bookings'
import disputeTypesReducer from './slices/disputeTypes'
import notificationTemplateReducer from './slices/notifications'
import bookingDisputesReducer from './slices/bookingDisputes'
import homepageReducer from './slices/Homepage'
import measurementsReducer from './slices/measurements'
import regionsReducer from './slices/regions'
import chatModuleReducer from './slices/chatModule'
import transactionsReducer from './slices/transactions'
import bookingTransactionsReducer from './slices/bookingTransactions'
import approvedUsersReducer from './slices/preApprovedUsers'
import referralBonusReducer from './slices/referralBonus'
import deactivationReasonsReducer from './slices/deactivationReasons'

export const store = configureStore({
  reducer: {
    categoriesListReducer,
    userProfileReducer,
    countriesListReducer,
    languagesListReducer,
    documentTypesReducer,
    userListingReducer,
    emailTemplateReducer,
    bookingsReducer,
    disputeTypesReducer,
    notificationTemplateReducer,
    bookingDisputesReducer,
    homepageReducer,
    measurementsReducer,
    regionsReducer,
    chatModuleReducer,
    transactionsReducer,
    bookingTransactionsReducer,
    approvedUsersReducer,
    referralBonusReducer,
    deactivationReasonsReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
