import BackgroundTimer from 'react-native-background-timer';

export function timer(fn, delay) {

    let timerId;

    return {
        start: () => {
            timerId = BackgroundTimer.setInterval(()=> {
                console.log('hello');
                fn();
            }, delay);
        },

        stop: () => {
            console.log(timerId);
            BackgroundTimer.clearInterval(timerId);
        }
    }
}

    // function startTimer() {
    //     timerId = BackgroundTimer.setInterval(()=> {
    //         console.log('hello');
    //     }, 5000);    
    // }
    // function stopTimer() {
    //     console.log(timerId);
    //     BackgroundTimer.clearInterval(timerId);
    // }