/* eslint-env jest */

jest.dontMock('../URL');

const {
	isValidURL,
	isValidMail,
	isValidTel,
	buildLink,
	parseURLs,
} = require('../URL');

describe('isValidURL', () => {
	it('should detect valid URLs', () => {
		expect(true).toBe(isValidURL('goo.gl'));
		expect(true).toBe(isValidURL('goo.gl/fb/QiUth'));
		expect(true).toBe(isValidURL('crazylink.mad#totes'));
		expect(true).toBe(isValidURL('feeds.feedburner.com/~r/funsurf/blog/~3/Nlm78LwLFeI/turn-your-windows-pc-into-wi-fi-hotspot.html?utm_source=feedburner&utm_medium=twitter&utm_campaign=satya164'));
		expect(true).toBe(isValidURL('www.google.com'));
		expect(true).toBe(isValidURL('google.com'));
		expect(true).toBe(isValidURL('google.co.in/'));
		expect(true).toBe(isValidURL('google.co.in/?q=crazy+long+urls'));
		expect(true).toBe(isValidURL('http://google.com'));
		expect(true).toBe(isValidURL('https://www.google.co.in'));
		expect(true).toBe(isValidURL('https://www.facebook.com/photo.php?fbid=1048881011810753&set=a.148270845205112.32456.100000665916861&type=3&theater'));
		expect(true).toBe(isValidURL('74.125.200.102'));
		expect(true).toBe(isValidURL('74.125.200.102:8080'));
		expect(true).toBe(isValidURL('ftp://74.125.200.102:8080/'));
	});

	it('should not detect invalid URLs', () => {
		expect(false).toBe(isValidURL('.wrong.lol'));
		expect(false).toBe(isValidURL('.something.com.'));
		expect(false).toBe(isValidURL('something.com.'));
		expect(false).toBe(isValidURL('http://something.com.'));
		expect(false).toBe(isValidURL('http://.something'));
		expect(false).toBe(isValidURL('https://.something.com'));
		expect(false).toBe(isValidURL('https://wrong../again'));
	});
});

describe('isValidMail', () => {
	it('should detect valid emails', () => {
		expect(true).toBe(isValidMail('someguy@somecompany.co'));
		expect(true).toBe(isValidMail('some.guy@somecompany.co'));
		expect(true).toBe(isValidMail('some-guy@somecompany.co'));
	});

	it('should not detect valid emails', () => {
		expect(false).toBe(isValidMail('someguy@somecompany'));
		expect(false).toBe(isValidMail('some.guy@somecompany'));
	});
});

describe('isValidTel', () => {
	it('should detect valid phone numbers', () => {
		expect(true).toBe(isValidTel('1234567890'));
		expect(true).toBe(isValidTel('123-456-7890'));
		expect(true).toBe(isValidTel('(123)456-7890'));
		expect(true).toBe(isValidTel('(123) 456-7890'));
		expect(true).toBe(isValidTel('123 456 7890'));
		expect(true).toBe(isValidTel('123.456.7890'));
		expect(true).toBe(isValidTel('+91 (123) 456-7890'));
		expect(true).toBe(isValidTel('+911234567890'));
		expect(true).toBe(isValidTel('tel:1234567890'));
		expect(true).toBe(isValidTel('tel:123-456-7890'));
		expect(true).toBe(isValidTel('tel:(123)456-7890'));
		expect(true).toBe(isValidTel('tel:(123) 456-7890'));
		expect(true).toBe(isValidTel('tel:123 456 7890'));
		expect(true).toBe(isValidTel('tel:123.456.7890'));
		expect(true).toBe(isValidTel('tel:+91 (123) 456-7890'));
		expect(true).toBe(isValidTel('tel:+911234567890'));
	});
});

describe('buildLink', () => {
	it('should build link if valid link passed', () => {
		expect('http://google.co.in/').toBe(buildLink('google.co.in/'));
		expect('http://google.co.in/').toBe(buildLink('http://google.co.in/'));
		expect('https://google.co.in/').toBe(buildLink('https://google.co.in/'));
		expect('ftp://74.125.200.102:8080/').toBe(buildLink('ftp://74.125.200.102:8080/'));
		expect('mailto:someguy@somecompany.co').toBe(buildLink('someguy@somecompany.co'));
		expect('mailto:someguy@somecompany.co').toBe(buildLink('mailto:someguy@somecompany.co'));
		expect('tel:123-456-7890').toBe(buildLink('123-456-7890'));
		expect('tel:123-456-7890').toBe(buildLink('tel:123-456-7890'));
	});

	it('should not build link if invalid link passed', () => {
		expect(null).toBe(buildLink('http://.something.com'));
		expect(null).toBe(buildLink('some.guy@somecompany'));
	});
});

describe('parseURLs', () => {
	it('should parse URLs from chunk of text', () => {
		expect([
			'http://google.co.in',
			'https://awesome.inc',
		]).toEqual(parseURLs(`
			Let's put some complex text with serveral links, such as google.co.in.
			And another like https://awesome.inc, with some invalid stuff like http://boo :D
		`));
	});
});
