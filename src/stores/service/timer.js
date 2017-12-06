import BackgroundTimer from 'react-native-background-timer';
import { store } from '../App';

export function timer() {
    let timerId;
    console.log(store);
    const { 
        appState,
        service : { 
            loggedIn : { 
                PING_DELAY_ACTIVE,
                PING_DELAY_BACKGROUND,
                PING_TIME_MULTIPLIER,
                postData,
                getUserData
            }}
    } = store;

    const getPingDelay = (appState) => {
        switch (appState) {
            case 'active':
                return PING_DELAY_ACTIVE;
            case 'background':
                return PING_DELAY_BACKGROUND;
        }
    };

    const sendData = () => {
        const data = loggedIn.getUserData();
        return postData(store.URL_ONLINE, data);
    }

    // need to declare the background timer function outside the class to get it work correctly

    return {
        start: () => {
            BackgroundTimer.clearInterval(timerId);

            let count = 0;
            const maxBackgroundTime = 
                PING_DELAY_BACKGROUND * PING_TIME_MULTIPLIER;

            timerId = BackgroundTimer.setInterval( () => {
                console.log('timer at work', getPingDelay);
                if (appState === 'active') {
                    sendData();
                } else if (appState === 'background') {
                    if (count >= maxBackgroundTime) {
                        console.log(count, 'terminating connection as the limit is reached');
                        loggedIn.pingIsActive = false;
                        BackgroundTimer.clearInterval(timerId);
                    } else {
                        sendData();
                    }
                    count += getPingDelay(appState);
                }
            }, getPingDelay(appState));
        },

        stop: () => {
            BackgroundTimer.clearInterval(timerId);    
        }
    }
}