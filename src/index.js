import './assets/scss/styles.scss';

class App {
	constructor() {
		this.workLength = 25;
		this.breakLength = 5;
		this.isTimerStopped = true;
		this.onWork = true;
		this.startAt = null;
		this.endAt = null;
		this.timeDisplay = document.getElementById('time-display');
		this.startButton = document.getElementById('start-button');
		this.stopButton = document.getElementById('stop-button');
		this.displayTime();
	}

	startTimer() {}
	updateTimer(){}

	displayTime() {
		let mins;
		let secs;
		if (this.isTimerStopped) {
			mins = this.workLength;
			secs = 0;
		}
	
		const minsString = mins.toString();
		let secsString = secs.toString();
	
		if (secs < 10) {
			secsString = `0${secsString}`;
		}
	
		this.timeDisplay.innerHTML = `${minsString}:${secsString}`;
	}
}


export default App;

window.addEventListener('load', () => new App());