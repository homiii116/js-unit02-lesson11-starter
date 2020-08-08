import './assets/scss/styles.scss';

class App {
	constructor() {
		this.workLength = 25;
		this.breakLength = 5;
		this.isTimerStopped = true;
		this.onWork = true;
		this.timeDisplay = document.getElementById('time-display');
	}
}

export default App;

window.addEventListener('load', () => new App());