import BackgroundTimer from 'react-native-background-timer';
import { store } from '../App';
    
let timerId;

export function startTimer(delay, maxTimeInBackground, appState,  fn) {
    let count = delay;
    BackgroundTimer.clearInterval(timerId);

    timerId = BackgroundTimer.setInterval( () => { 
        if (appState === 'background') {
            console.log('timer at work on background', delay, count);
            if (count >= maxTimeInBackground) {
                console.log(count, 'terminating connection as the limit is reached');
                store.service.loggedIn.pingIsActive = false;
                BackgroundTimer.clearInterval(timerId);
            } else { 
                fn();
            }
            count += delay;
        } else if (appState === 'active') {
            console.log('timer at work on active mode');
            fn();
        }
    }, delay);
};

export function stopTimer() {
    BackgroundTimer.clearInterval(timerId);
};