export type IStorageType = 'session' | 'local';

export type IStorageReturn = {
	getItem: (key: string, type?: IStorageType) => string | null;
	setItem: (key: string, value: string, type?: IStorageType) => boolean;
	removeItem: (key: string, type?: IStorageType) => void;
};
