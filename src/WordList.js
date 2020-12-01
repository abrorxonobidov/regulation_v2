const WordList = {
    offers: {
        ru: 'Предложения',
        uz: 'Таклифлар',
        oz: 'Takliflar'
    },
    showOffers: {
        ru: 'Показат предложении',
        uz: 'Таклифларни кўрсатиш',
        oz: 'Takliflarni koʻrsatish'
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
    }
};

export const getTranslate = (key, lang = null) => {
    return WordList[key][lang ?? getCurrentLang()]
};

let getCurrentLang = () => {
    return document.getElementById('html').getAttribute('lang')
};

//export default WordList;