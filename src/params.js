/**
 * Abrorxon Obidov
 * Date: 2020-12-03
 */


export let apiUrl = (action) => hostname + '/' + currentLang + '/api/' + action;


export let hostname = window.location.hostname === 'localhost' ? 'http://regulation.track.uz/abrorxon/f_v2' : 'https://regulation.gov.uz';


export const currentLang = document.getElementById('html').getAttribute('lang') || 'uz';


export const staticUserSpecList = [
    {id: 1, title: 'Тадбиркор'},
    {id: 2, title: 'Давлат хизматчиси'},
    {id: 3, title: 'Илмий изланувчи'},
    {id: 4, title: 'Мустақил изланувчи'},
    {id: 5, title: 'Журналист/блогер'},
    {id: 6, title: 'Халқаро ташкилот ҳодими'},
    {id: 7, title: 'Дастурчи'}
];


export const userFileConfig = {
    allowedExtensions: ['doc', 'docx', 'pdf'],
    maxFileSize: 20971520, //bytes
    minFileSize: 1024 //bytes
};