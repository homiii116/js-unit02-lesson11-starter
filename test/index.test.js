import App from '../src/index';
import template from './template';
import moment from 'moment';

describe('displayTime', () => {
	test('初期化時に25:00を表示する。', () => {
		document.body.innerHTML = template;
		const app = new App();
		const timeDisplay = document.getElementById('time-display');
		expect(app.isTimerStopped).toBeTruthy();
		expect(timeDisplay.innerHTML).toEqual('25:00');
	});
	
	test('カウントダウン中の時間を適切に表示する。', () => {
		document.body.innerHTML = template;
		const app = new App();
		const now = moment();
		const startOfToday = now.startOf('day');
		app.startButton.disabled = true;
		app.stopButton.disabled = false;
		app.isTimerStopped = false;
		app.startAt = startOfToday;
		app.endAt = moment(startOfToday).add(25, 'minutes');
		app.displayTime(moment(startOfToday).add(51, 'seconds'));
		const timeDisplay = document.getElementById('time-display');
		expect(timeDisplay.innerHTML).toEqual('24:09');
	})
});

describe('startTimer', () => {
	test('スタートボタンにdisable属性を追加', () => {
		document.body.innerHTML = template;
		const app = new App();
		app.startTimer();
		const startButton = document.getElementById('start-button');
		const stopButton = document.getElementById('stop-button');
		expect(startButton.disabled).toEqual(true);
		expect(stopButton.disabled).toEqual(false);
		expect(app.isTimerStopped).toEqual(false);
	});

	test('startAtとendAtを適切に設定する。', () => {
		document.body.innerHTML = template;
		const app = new App();
		const now = moment();
		app.startTimer(null, now);
		expect(app.startAt.valueOf()).toEqual(now.valueOf());
		expect(app.endAt.valueOf()).toEqual(now.add(25, 'minutes').valueOf());
	})
});