import './assets/scss/styles.scss';
import moment from 'moment';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const DAY = 24 * 60 * MINUTE;

class App {
	constructor() {
	this.workLength = 25;
	this.breakLength = 5;
	this.isTimerStopped = true;
	this.onWork = true;
	this.startAt = null; //カウントダウン開始時の時間
	this.endAt = null; //カウントダウン終了時の時間
	this.getElements();
	this.toggleEvents();
	this.startTimer = this.startTimer.bind(this);
	this.updateTimer = this.updateTimer.bind(this);
	this.displayTime = this.displayTime.bind(this);

	this.displayTime();
	}

	getElements() {
		this.timeDisplay = document.getElementById('time-display');
		this.startButton = document.getElementById('start-button');
		this.stopButton = document.getElementById('stop-button');
	}

	toggleEvents() {
		this.startButton.addEventListener('click', this.startTimer);
	}

	startTimer(e = null, time = moment()) {
		if (e)e.preventDefault();
		this.startButton.disabled = true;
		console.log(this.startButton.disabled);
		this.stopButton.disabled = false;
		this.isTimerStopped = false;
		this.startAt = time;
		const startAtClone = moment(this.startAt);
		this.endAt = startAtClone.add(this.workLength, 'minutes');
		this.timerUpdater = window.setInterval(this.updateTimer, 500);
		this.displayTime();
	}

	updateTimer(time = moment()) {
		this.displayTime(time);
	}

	displayTime(time = moment()) {
		let mins;
		let secs;
		if (this.isTimerStopped) {
			mins = this.workLength.toString();
			secs = 0;
		} else {
			const diff = this.endAt.diff(time);
			mins = Math.floor(diff / MINUTE);
			secs = Math.floor((diff % MINUTE) / 1000);
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