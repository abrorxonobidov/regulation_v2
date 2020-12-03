/**
 * Abrorxon Obidov
 * Date: 2020-12-03
 */


export let ApiUrl = (action) => hostname + '/' + currentLang + '/api/' + action;


export let hostname = window.location.hostname === 'localhost' ? 'http://regulation.track.uz/abrorxon/f_v2' : 'https://regulation.gov.uz';


export const currentLang = document.getElementById('html').getAttribute('lang');
