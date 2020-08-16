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

describe('updateTimer', () => {
	test('作業時間がおわったら休憩時間に切り替える。', () => {
		document.body.innerHTML = template;
		const app = new App();
		const now = moment();
		const startOfToday = now.startOf('day');
		// 作業中の状態を作り出す
		app.startButton.disabled = true;
		app.stopButton.disabled = false;
		app.isTimerStopped = false;
		app.startAt = startOfToday;
		app.endAt = moment(startOfToday).add(25, 'minutes');
		// 終了時刻から100ミリ秒後の時間でテストを行う。
		app.updateTimer(moment(startOfToday).add(25, 'minutes').add(100, 'millisecond'));
		const timeDisplay = document.getElementById('time-display');
		expect(timeDisplay.innerHTML).toEqual('5:00');
		expect(app.onWork).not.toBeTruthy(); // 休憩時間に切り替わっている。
		expect(app.getHistory()).toEqual([endAt.add(100, 'millisecond').valueOf()]); // データの保存を確認
	});
	
	test('休憩時間が終わったら作業時間に切り替える。', () => {
		document.body.innerHTML = template;
		const app = new App();
		const now = moment();
		const startOfToday = now.startOf('day');
		// 休憩中の状態を作り出す。
		app.onWork = false;
		app.startButton.disabled = true;
		app.stopButton.disabled = false;
		app.isTimerStopped = false;
		app.startAt = startOfToday;
		app.endAt = moment(startOfToday).add(5, 'minutes');
		// 終了時刻から100ミリ秒後の時間でテストを行う。
		app.updateTimer(moment(startOfToday).add(5, 'minutes').add(100, 'millisecond'));
		const timeDisplay = document.getElementById('time-display');
		expect(timeDisplay.innerHTML).toEqual('25:00');
		expect(app.onWork).toBeTruthy(); // 作用時間に切り替わっている。
	})
})

describe('stopTimer', () => {
	test('it should reset the timer', () => {
		document.body.innerHTML = template;
		const app = new App();
		const now = moment();
		const startOfToday = now.startOf('day');
		app.startButton.disabled = true;
		app.stopButton.disabled = false;
		app.isTimerStopped = false;
		app.startAt = startOfToday;
		app.endAt = moment(now).add(20, 'minutes');
		app.stopTimer();
		const timeDisplay = document.getElementById('time-display');
		expect(timeDisplay.innerHTML).toEqual('25:00');
		expect(app.onWork).toBeTruthy();
		expect(app.isTimerStopped).toBeTruthy();
		expect(app.startButton.disabled).not.toBeTruthy();
	});
});

describe('App.getHistory', () => {
	test('終了した作業インターバルの終了時間一覧を取得する。', () => {
		const startOfToday = moment().startOf('day');
		const val1 = moment(startOfToday).subtract(5, 'days').add(30, 'minutes').valueOf();
		const val2 = moment(startOfToday).subtract(5, 'days').add(60, 'minutes').valueOf();
		const collection = [val1, val2];
		// intervalDataというkey名でデータを保存
		localStorage.setItem('intervalData', JSON.stringify(collection));
		expect(App.getHistory()).toContain(val1);
		localStorage.clear();
	})
})

describe('saveIntervalData', () => {
	test('it should be save array of items', () => {
		document.body.innerHTML = template;
		const app = new App();
		const startOfToday = moment().startOf('day');
		// 作業終了時の時間のテストデータを作成
		const item = moment(startOfToday).subtract(5, 'days').add(60, 'minutes');
		app.saveIntervalData(item);
		expect(JSON.parse(localStorage.getItem('intervalData'))).toContain(item.valueOf());
		localStorage.clear();
	});
});

describe('displayCyclesToday', () => {
	test('当日の完了した作業サイクル数を表示する。', () => {
		document.body.innerHTML = template;
		const app = new App();
		const startOfToday = moment().startOf('day');
		const time = moment(startOfToday).add(5, 'hours'); //現在時刻を、午前5時に設定
		const val1 = moment(startOfToday).add(30, 'minutes').valueOf();  // 午前0:30に作業完了
		const val2 = moment(startOfToday).add(60, 'minutes').valueOf();  // 午前1:00に作業完了
		const collection = [val1, val2];
		localStorage.setItem('intervalData', JSON.stringify(collection));
		app.displayCyclesToday(time);
		const countToday = document.getElementById('count-today');
		const percentToday = document.getElementById('percent-today');
		expect(countToday.innerHTML).toEqual('2回 / 4回');
		expect(percentToday.innerHTML).toEqual('目標を50%達成中です。');
		localStorage.clear();
	})
})