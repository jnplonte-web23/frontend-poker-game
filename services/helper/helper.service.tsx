import { toJson, toString, isNotEmpty, isEmpty, isEmptyObject } from 'jnpl-helper';

import { formatUnits } from '@ethersproject/units';

export class Helper {
	ENV: string = '';

	constructor() {
		this.ENV = process.env.NODE_ENV || '';
	}

	toJson(jsonData: any = ''): any {
		return toJson(jsonData);
	}

	toString(jsonData: any = ''): any {
		return toString(jsonData);
	}

	isNotEmpty(v: any = null): boolean {
		return isNotEmpty(v);
	}

	isEmpty(v: any = null): boolean {
		return isEmpty(v);
	}

	isEmptyObject(v: any = null): boolean {
		return isEmptyObject(v);
	}

	isEmptyAddress(v: any = null): boolean {
		return v.toString() === '0x0000000000000000000000000000000000000000';
	}

	parseBalance(balance: number, decimals: number = 18, decimalsToDisplay: number = 3): string {
		return Number(formatUnits(balance, decimals)).toFixed(decimalsToDisplay);
	}

	shorthenAddress(address: string): string {
		return `${address.slice(0, 12)}...${address.slice(address.length - 3, address.length)}`;
	}

	conCatAccounts = (lastAccs: string, Acc: string) => {
		return lastAccs + ' ' + Acc;
	};
}
