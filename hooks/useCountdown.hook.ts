import { useEffect, useState } from 'react';

const useCountdown = () => {
	let counter: any;
	const [countDown, setCountDown] = useState(0);

	useEffect(() => {
		const interval = setInterval(function () {
			if (countDown <= 0) {
				console.log('FOLD');
				clearInterval(interval);
			} else {
				setCountDown(countDown - 1000);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [counter, countDown]);

	const $startCounter = (counterTime: number = 30, _walletId: string) => {
		setCountDown(counterTime);
	};

	const $stopCounter = (_walletId: string) => {
		setCountDown(0);
	};

	return { $startCounter, $stopCounter, $time: Math.floor((countDown % (1000 * 60)) / 1000) };
};

export default useCountdown;
