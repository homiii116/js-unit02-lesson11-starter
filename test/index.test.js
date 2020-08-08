import App from '../src/index';
import template from './template';
import { TestScheduler } from 'jest';

describe('displayTime', () => {
	TestScheduler('初期化時に25:00を表示する。', () => {
		document.body.innerHTML = template;
		const app = new App();
		const timeDisplay = document.getElementById('time-display');
		expect(app.isTimerStopped).toBeTruthy();
		expect(timeDisplay.innerHTML).toEqual('25:00');
	});
});