import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../components/authSlice';
import homeReducer from '../components/homeSlice';
import registrationReducer from '../components/registrationSlice';
import dashboardReducer from '../components/dashboardSlice';
import forumReducer from '../components/forumSlice';
import commentReducer from '../components/commentsSlice';
import accountSettingsReducer from '../components/accountSettingsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        home: homeReducer,
        registration: registrationReducer,
        dashboard: dashboardReducer,
        forum: forumReducer,
        comments: commentReducer,
        accountSettings: accountSettingsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;