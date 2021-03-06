$(document).ready(function () {
    $(document).keydown(function (e) {
        let selText = "";
        if (document.getSelection) {
            selText = document.getSelection().toString();
        } else if (document.selection) {
            selText = document.selection.createRange().text;
        } else if (window.getSelection) {
            selText = window.getSelection().toString();
        }
        if (selText !== "") {
            let alertTexts = {
                oz: {
                    errorDetected: '"' + selText.toString() + '"' + " matnida xatolik aniqlandi! \n\n",
                    enterCorrectText: "To'g'ri variantni kiriting",
                    thanks: "Rahmat! Xabaringiz Portal ma’muriyatiga muvafaqqiyatli yuborildi",
                    similarText: "Xatolik va xatolikka bildirilgan taklif bir xil bo'lishi mumkin emas",
                    emptyText: "Matn kiritilmadi",
                    tooLongText: "Xatolik to'g'risida xabar yuborish uchun 3 dan 20 gacha belgidan iborat o'lchamdagi matn blokini ajrating",
                    connectionError: "Xatolik yuz berdi. Iltimos, internet tarmog'i bilan aloqa mavjudligini tekshirib ko'ring"
                },
                uz: {
                    errorDetected: '"' + selText.toString() + '"' + " матнида хатолик аниқланди! \n\n",
                    enterCorrectText: "Тўғри вариантни киритинг",
                    thanks: "Рахмат! Хабарингиз Портал маъмуриятига мувафаққиятли юборилди",
                    similarText: "Хатолик ва хатоликка билдирилган таклиф бир хил бўлиши мумкин эмас",
                    emptyText: "Матн киритилмади",
                    tooLongText: "Хатолик тўғрисида хабар юбориш учун 3 дан 20 гача белгидан иборат ўлчамдаги матн блокини ажратинг",
                    connectionError: "Хатолик юз берди. Илтимос, интернет тармоғи билан алоқа мавжудлигини текшириб кўринг"
                },
                ru: {
                    errorDetected: "В тексте '" + selText.toString() + "' обнаружена ошибка! \n\n",
                    enterCorrectText: "Введите правильный вариант",
                    thanks: "Спасибо! Ваше сообщение отправлено администрации Портала",
                    similarText: "Ошибочный текст и предлагаемый вариант не могут быть одинаковыми",
                    emptyText: "Текст не введен",
                    tooLongText: "Для отправки сообщения об ошибке выделите блок текста с ошибкой размером от 3 до 20 символов",
                    connectionError: "Произошла ошибка. Пожалуйста, проверьте ваше интернет-соединение"
                },
                en: {
                    errorDetected: "There is a mistake in the text: '" + selText.toString() + "'\n\n",
                    enterCorrectText: "Enter the correct option",
                    thanks: "Thank you! Your message has been sent to admission.",
                    similarText: "The erroneous text and the proposed option may not be the same",
                    emptyText: "No text entered",
                    tooLongText: "To send an error message select a block of text with an error sized from 3 to 20 characters",
                    connectionError: "An error occurred. Please, check your internet connection"
                }
            };
            e = e || window.event;
            if (e.ctrlKey && e.keyCode === 13) {
                let curUrl = window.location.href;
                let lang = $('html').attr('lang');
                if (selText.length > 2 && selText.length < 20) {
                    let s = prompt(alertTexts[lang].errorDetected, alertTexts[lang].enterCorrectText);
                    if (s !== '' && s != null) {
                        if (selText !== s) {
                            $.ajax({
                                url: ajaxControllerUrl('check'),
                                type: 'post',
                                data: {
                                    errText: selText,
                                    correctText: s,
                                    curl: curUrl
                                },
                                success: function (response) {
                                    if (response === "SUCCESS") {
                                        alert(alertTexts[lang].thanks)
                                    } else {
                                        alert(alertTexts[lang].connectionError);
                                    }
                                },
                                error: function () {
                                    alert(alertTexts[lang].connectionError + '...');
                                }
                            });
                        } else {
                            alert(alertTexts[lang].similarText + '...');
                        }
                    } else {
                        alert(alertTexts[lang].emptyText + '...');
                    }
                } else {
                    alert(alertTexts[lang].tooLongText + '...');
                }
            }
        }
    });
});