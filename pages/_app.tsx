import { useEffect } from 'react';
import { Provider, useDispatch } from "react-redux";
import store from "../store/store";
import type { AppProps } from "next/app";
import '../components/styles/globals.scss';
import '../components/styles/Animation.scss';
import Dashboard from "./dashboard";
import { setLoggedIn, setToken, setUserId } from '../components/authSlice';


const App = ({ Component, pageProps }: AppProps) => {

    return (
        <Provider store={store}>
            <RehydrateState />
            <Dashboard />
            <Component {...pageProps} />
        </Provider>
    );
}

const RehydrateState = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
            dispatch(setToken(token));
            dispatch(setUserId(userId));
            dispatch(setLoggedIn(true));
        }
    }, [dispatch]);
    return null;
}

export default App;