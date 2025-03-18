import { createIntl, createIntlCache } from 'react-intl';

export interface ILocale {
	name: string;
	file: string;
	locale: string[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	messages?: any;
}

export const localeList = [
	{
		name: 'Türkçe',
		file: 'tr',
		locale: [ 'tr', 'tr-tr' ]
	},
	{
		name: 'English',
		file: 'en',
		locale: [ 'en', 'en-en' ]
	},
	{
		name: 'Español',
		file: 'es',
		locale: [ 'es', 'es-es' ]
	}
];

const cache = createIntlCache();

export let intl = createIntl({
	locale: 'tr',
}, cache);

/**
 * Detect the browser language.
 * 
 * @returns {string} The browser locale
 */
export const detect = (): string => {
	const localeFull =
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(navigator.language || (navigator as any).browserLanguage).toLowerCase();

	return localeFull;
};

/**
 * Change the locale.
 * 
 * @param {string} locale The locale to change to
 * @returns {Promise<string>} The locale
 */
export const loadLocale = async (locale: string): Promise<string> => {
	let res: ILocale;

	try {
		res = localeList.filter((item) => item.locale.includes(locale))[0];
		res.messages = await import(`../translations/${res.file}.json`);
	} catch {
		res = localeList.filter((item) => item.locale.includes('en'))[0];
		res.messages = await import(`../translations/${res.file}.json`);
	}

	intl = createIntl({
		locale: res.locale[0],
		messages: res.messages.default,
	}, cache);

	return res.locale[0];
};
