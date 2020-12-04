/**
 * @author Abrorxon Obidov
 * @date 2020-12-03
 */


import {currentLang} from "./params";


const WordList = {
    offers: {
        ru: 'Предложения',
        uz: 'Таклифлар',
        oz: 'Takliflar'
    },
    showComments: {
        ru: 'Показат предложении',
        uz: 'Таклифларни кўрсатиш',
        oz: 'Takliflarni koʻrsatish'
    },
    hideComments: {
        ru: 'Скрыть предложении',
        uz: 'Таклифларни ёпиш',
        oz: 'Takliflarni yopish'
    },
    support_count: {
        ru: 'Количество голосов',
        uz: 'Овозлар сони',
        oz: 'Ovozlar soni'
    },
    no_comment: {
        ru: 'Нет комментариев',
        uz: 'Таклифлар мавжуд эмас',
        oz: 'Takliflar mavjud emas'
    },
    support_btn_text: {
        ru: 'Поддержать',
        uz: 'Қўллаб-қувватлаш',
        oz: 'Qoʻllab-quvvatlash'
    },
    supported_text: {
        ru: 'Поддержали',
        uz: 'Қўллаб-қувватладингиз',
        oz: 'Qoʻllab-quvvatladingiz'
    },
    reply_btn_text: {
        ru: 'Ответить',
        uz: 'Жавоб бериш',
        oz: 'Javob berish'
    },
    accepted_comment: {
        ru: 'Принято',
        uz: 'Қабул қилинди',
        oz: 'Qabul qilindi'
    },
    denied_comment: {
        ru: 'Отклонено',
        uz: 'Рад этилди',
        oz: 'Rad etildi'
    },
    hidden_comment: {
        ru: 'Удалено',
        uz: 'Ўчирилди',
        oz: 'Oʻchirildi'
    },
    hidden_description: {
        ru: 'Обоснование',
        uz: 'Асос',
        oz: 'Asos'
    },
    textIsEmpty: {
        ru: 'Введите текст',
        uz: 'Матнни киритинг',
        oz: 'Matnni kiriting'
    },
    download: {
        ru: 'Скачать',
        uz: 'Юклаб олиш',
        oz: 'Yuklab olish'
    },
    asos: {
        ru: 'Обоснование',
        uz: 'Асос',
        oz: 'Asos'
    },
    text_here: {
        ru: 'Введите текст',
        uz: 'Матнни киритинг',
        oz: 'Matnni kiriting'
    },
    leaveComment: {
        ru: 'Отправить предложение',
        uz: 'Таклиф қолдириш',
        oz: 'Taklif qoldirish'
    }
};


export let translate = (key) =>  WordList[key][currentLang];