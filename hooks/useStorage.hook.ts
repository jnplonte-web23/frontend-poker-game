import type { IStorageType, IStorageReturn } from '../interfaces';

const useStorage = (_type?: IStorageType): IStorageReturn => {
	const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();
	let storageType: any = null;
	if (_type === 'local') {
		storageType = isBrowser ? window.localStorage : null;
	} else {
		storageType = isBrowser ? window.sessionStorage : null;
	}

	const getItem = (_key: any): any => {
		return isBrowser && storageType ? storageType[_key] : null;
	};

	const setItem = (key: string, value: string): boolean => {
		if (isBrowser && storageType) {
			storageType.setItem(key, value);
			return true;
		}

		return false;
	};

	const removeItem = (key: string): void => {
		if (isBrowser && storageType) {
			storageType.removeItem(key);
		}
	};

	return {
		getItem,
		setItem,
		removeItem,
	};
};

export default useStorage;
