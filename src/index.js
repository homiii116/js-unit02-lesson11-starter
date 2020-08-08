import './assets/scss/styles.scss';

class App {
	constructor() {
		this.workLength = 25;
		this.breakLength = 5;
		this.isTimerStopped = true;
		this.onWork = true;
	}
}

window.addEventListener('load', () => new App());