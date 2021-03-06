/**
 * @author Abrorxon Obidov
 * @date 2020-12-03
 */


import {currentLang} from "./params";


export let translate = (key) => {
    return wordList[key] ? wordList[key][currentLang] : key
};


export let translateParams = (key, params) => {
    if (!wordList[key]) return key;
    let word = wordList[key][currentLang];
    for (let paramName in params)
        if (params.hasOwnProperty(paramName))
            word = word.replace('{' + paramName + '}', params[paramName]);
    return word;
};


const wordList = {
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
    text_here: {
        ru: 'Введите текст',
        uz: 'Матнни киритинг',
        oz: 'Matnni kiriting'
    },
    leaveComment: {
        ru: 'Отправить предложение',
        uz: 'Таклиф қолдириш',
        oz: 'Taklif qoldirish'
    },
    chooseFile: {
        ru: 'Выберите файл',
        uz: 'Файлни танланг',
        oz: 'Faylni tanlang'
    },
    chooseSpec: {
        ru: 'Выберите профессию',
        uz: 'Мутахассисликни танланг',
        oz: 'Mutaxassislikni tanlang'
    },
    incompatibleFile: {
        ru: 'Произошла ошибка при загрузке файла',
        uz: 'Файл юклашда хатолик юз берди',
        oz: 'Fayl yuklashda xatolik yuz berdi'
    },
    incompatibleFileSize: {
        ru: 'Размер файла должен быть больше <b>1 KB</b> и меньше <b>20 МБ</b>',
        uz: 'файл хажми <b>1 KB</b> дан катта ва <b>20 МБ</b> дан кичик бўлиши лозим',
        oz: 'Fayl hajmi <b>1 KB</b> dan katta va <b>20 МБ</b> dan kichik boʻlishi lozim'
    },
    allowedExtensions: {
        ru: 'Разрешены только файлы {extensions}',
        uz: 'Фақат {extensions} файллар рухсат этилган',
        oz: 'Faqat {extensions} fayllar ruxsat etilgan'
    },
    processing: {
        ru: 'Загрузка',
        uz: 'Юкланмоқда',
        oz: 'Yuklanmoqda'
    },
    errorInConnection: {
        ru: 'Ошибка сети',
        uz: 'Тармоқда хатолик',
        oz: 'Tarmoqda xatolik'
    },
    errorInSystem: {
        ru: 'Системная ошибка',
        uz: 'Тизим хатоси',
        oz: 'Tizimda xatosi'
    },
    authNeededToLike: {
        ru: 'Вы должны быть <a href="#login-modal" data-toggle="modal">Авторизованы</a>, чтобы проголосовать',
        uz: 'Овоз бериш учун <a href="#login-modal" data-toggle="modal">Авторизациядан ўтиш</a>ингиз лозим',
        oz: 'Ovoz berish uchun <a href="#login-modal" data-toggle="modal">Avtorizatsiyadan oʻtish</a>ishingiz lozim'
    },
    authNeededToComment: {
        ru: 'Вы должны быть <a href="#login-modal" data-toggle="modal">Авторизованы</a>, чтобы оставить предложение',
        uz: 'Таклиф қолдириш учун <a href="#login-modal" data-toggle="modal">Авторизациядан ўтиш</a>ингиз лозим',
        oz: 'Taklif qoldirish uchun <a href="#login-modal" data-toggle="modal">Avtorizatsiyadan oʻtish</a>ishingiz lozim'
    }

};
