/**
 * Created by Abrorxon Obidov
 * on 12.08.2020.
 * JS for comments
 */

const lang = $('html').attr('lang');

const userData = $('span#user-data').data();

const user = userData['userId'];

let ajaxControllerUrl = (action) => window.location.origin + userData['baseUrl'] + '/' + lang + '/ajax/' + action;


const wordList = {
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
    dcf: {
        ru: 'Скачать',
        uz: 'Юклаб олиш',
        oz: 'Yuklab olish'
    }
};


$('.hide_comments').click(e => {
    let button = $(e.target);
    let data = button.data();
    button.addClass('hidden');
    button.siblings('button').removeClass('hidden');
    $('.comment-area-' + data['doc_id']).parent().addClass('hidden');
});


const showCommentsBtn = $('.show_comments');


const urlParams = new URLSearchParams(window.location.search);


$(document).ready(function () {
    /** Show comment script */
    if (urlParams.get('c_i')) {
        showCommentsBtn.click();
        $('html, body').animate({
            scrollTop: document.body.scrollHeight + 1000
        }, 800);
    }
});


showCommentsBtn.click(e => {

    let button = $(e.target);
    let data = button.data();
    let commentTextUl = $('.comment-area-' + data['doc_id']);

    button.addClass('disabled');

    $.ajax({
        url: ajaxControllerUrl('get-comments'),
        type: 'POST',
        data: data,
        beforeSend: function () {
            $('.comment-loader').removeClass('hidden');
        },
        success: function (response) {
            let user_comment_html = '';
            if (response.length > 0) {
                let temp = $('<div/>');
                response.map(comment => temp.append(generateCommentHtml(comment)));
                user_comment_html = temp.html();
            } else {
                user_comment_html = '<li class="their_text no_comment"><div class="text_write"><p>' + wordList.no_comment[lang] + '</p></div></li>';
            }
            button.addClass('hidden');
            button.siblings('button').removeClass('hidden');
            commentTextUl.html(user_comment_html);
            commentTextUl.parent().removeClass('hidden');
            $('.comment-loader').addClass('hidden');
        },
        error: error => console.log('error', error)
    });

    button.removeClass('disabled');

    $('#c-form-summer-note').summernote({
        placeholder: wordList.textIsEmpty[lang] + '...',
        style: 'margin-top:100px;',
        height: 200,
        toolbar: [
            ['font', ['bold', 'italic', 'underline']],
            ['para', ['undo', 'redo', 'help']]
        ],
        callbacks: {
            onKeydown: function (e) {
                let t = e.currentTarget.innerText;
                if (t.trim().length >= 1000) {
                    //delete keys, arrow keys, copy, cut
                    if (e.keyCode !== 8 && !(e.keyCode >= 37 && e.keyCode <= 40) && e.keyCode !== 46 && !(e.keyCode === 88 && e.ctrlKey) && !(e.keyCode === 67 && e.ctrlKey))
                        e.preventDefault();
                }
            },
            onPaste: function (e) {
                let t = e.currentTarget.innerText;
                let bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
                e.preventDefault();
                let maxPaste = bufferText.length;
                if (t.length + bufferText.length > 1000) {
                    maxPaste = 1000 - t.length;
                }
                if (maxPaste > 0) {
                    document.execCommand('insertText', false, bufferText.substring(0, maxPaste));
                }
            }
        }
    });


});


let supportComment = (btn) => {
    let data = $(btn).data();

    $.ajax({
        url: ajaxControllerUrl('support-comment'),
        type: 'POST',
        data: data,
        success: (response) => {
            if (response['status']) {
                let parentNode = $(btn).parent();
                $(btn).remove();
                parentNode.prepend(
                    $('<button/>', {
                        'html': '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 172.05 165.18"><g id="liked"><path style="fill:#05439D" d="M166.14 91.73c3.94,-4.52 5.91,-9.86 5.91,-16.03 0,-5.58 -2.05,-10.42 -6.12,-14.52 -4.09,-4.09 -8.93,-6.13 -14.52,-6.13l-29.79 0c0.28,-1.01 0.57,-1.86 0.86,-2.58 0.28,-0.72 0.69,-1.51 1.18,-2.37 0.5,-0.86 0.87,-1.5 1.08,-1.94 1.29,-2.44 2.28,-4.45 2.96,-6.02 0.68,-1.58 1.35,-3.73 2.04,-6.45 0.69,-2.72 1.02,-5.45 1.02,-8.18 0,-1.72 -0.02,-3.12 -0.05,-4.19 -0.03,-1.08 -0.22,-2.69 -0.53,-4.84 -0.32,-2.16 -0.76,-3.94 -1.29,-5.38 -0.54,-1.43 -1.4,-3.04 -2.58,-4.84 -1.19,-1.79 -2.62,-3.24 -4.3,-4.35 -1.68,-1.11 -3.84,-2.04 -6.45,-2.79 -2.62,-0.76 -5.57,-1.13 -8.88,-1.13 -1.86,0 -3.47,0.69 -4.84,2.05 -1.43,1.43 -2.65,3.23 -3.66,5.37 -1,2.15 -1.7,4.01 -2.1,5.59 -0.39,1.57 -0.84,3.76 -1.34,6.56 -0.65,3 -1.13,5.17 -1.45,6.5 -0.32,1.32 -0.95,3.06 -1.89,5.21 -0.93,2.16 -2.04,3.87 -3.34,5.16 -2.36,2.37 -5.98,6.67 -10.86,12.9 -3.52,4.6 -7.14,8.93 -10.86,13.01 -3.73,4.09 -6.46,6.2 -8.18,6.35 -1.79,0.14 -3.34,0.88 -4.63,2.2 -1.29,1.33 -1.94,2.89 -1.94,4.68l0 68.94c0,1.85 0.69,3.46 2.05,4.78 1.36,1.33 2.97,2.03 4.84,2.1 2.51,0.07 8.17,1.65 16.99,4.74 5.52,1.86 9.84,3.28 12.96,4.24 3.11,0.97 7.47,2.01 13.06,3.12 5.58,1.11 10.75,1.66 15.48,1.66l1.82 0 8.18 0 3.87 0c9.54,-0.14 16.59,-2.94 21.18,-8.39 4.16,-4.95 5.92,-11.43 5.27,-19.47 2.8,-2.65 4.74,-6.02 5.81,-10.11 1.22,-4.36 1.22,-8.56 0,-12.58 3.3,-4.36 4.84,-9.28 4.63,-14.73 0.01,-2.3 -0.53,-5.02 -1.6,-8.18z"/><path style="fill:#05439D" d="M37.85 68.83l-30.97 0c-1.86,0 -3.49,0.68 -4.85,2.04 -1.36,1.36 -2.04,2.97 -2.04,4.84l0 68.83c0,1.86 0.68,3.48 2.04,4.84 1.37,1.36 2.98,2.05 4.85,2.05l30.97 0c1.86,0 3.48,-0.69 4.84,-2.05 1.36,-1.36 2.04,-2.97 2.04,-4.84l0 -68.83c0,-1.86 -0.68,-3.48 -2.04,-4.84 -1.36,-1.36 -2.97,-2.04 -4.84,-2.04zm-12.37 66.83c-1.36,1.32 -2.97,1.99 -4.84,1.99 -1.94,0 -3.57,-0.67 -4.89,-1.99 -1.33,-1.33 -2,-2.96 -2,-4.9 0,-1.86 0.67,-3.48 2,-4.84 1.32,-1.36 2.95,-2.04 4.89,-2.04 1.86,0 3.48,0.68 4.84,2.04 1.36,1.36 2.05,2.97 2.05,4.84 0,1.94 -0.69,3.57 -2.05,4.9z"/></g></svg>',
                    })
                );
                $('#c-c-' + data['comment_id']).text(response['count'])
            } else {
                console.log(response);
                alert(response['alertText']);
            }
        },
        error: error => console.log('error', error)

    });
};


const generateCommentHtml = comment => {

    let li = $('<li/>', {'class': 'their_text'});
    let special = comment['special'] ? '<span class="badge badge_green">' + comment['special'] + '</span>' : '';

    $('<div/>', {
        class: 'their_name',
        html: '<span>' + comment['full_name'] + special + '</span><span class="comment_date">' + comment['created_at'] + '</span>'
    }).appendTo(li);

    let blockClass = 'text_write';
    let content = comment['content'];

    if (comment['is_hidden']) {
        let reason_to_hide = comment['reason_to_hide'] ? '<div class="reason_to_hide"><b>' + wordList.hidden_description[lang] + ': </b>' + comment['reason_to_hide'] + '</div>' : '';
        blockClass += ' hidden_block';
        content = '<p class="hidden_comment">' + wordList.hidden_comment[lang] + '</p>' + content +
            '<div class="their_name"><span>' + $('#authority-title').text() + '</span></div>' + reason_to_hide;
    } else if (comment['is_applied']) {
        blockClass += ' green_block';
        content = '<p class="accepted">' + wordList.accepted_comment[lang] + '</p>' + content;
    }

    $('<div/>', {
        class: blockClass,
        html: content
    }).appendTo(li);

    let like_div = $('<div/>', {'class': 'like_btn'});
    let reply_div_btn;
    let reply_text_area;

    if (user) { // agar user avtorizatsiyadan o'tgan bo'lsa
        if (comment['is_supported'])
            like_div.append($('<button/>', {
                html: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 172.05 165.18"><g id="liked"><path style="fill:#05439D" d="M166.14 91.73c3.94,-4.52 5.91,-9.86 5.91,-16.03 0,-5.58 -2.05,-10.42 -6.12,-14.52 -4.09,-4.09 -8.93,-6.13 -14.52,-6.13l-29.79 0c0.28,-1.01 0.57,-1.86 0.86,-2.58 0.28,-0.72 0.69,-1.51 1.18,-2.37 0.5,-0.86 0.87,-1.5 1.08,-1.94 1.29,-2.44 2.28,-4.45 2.96,-6.02 0.68,-1.58 1.35,-3.73 2.04,-6.45 0.69,-2.72 1.02,-5.45 1.02,-8.18 0,-1.72 -0.02,-3.12 -0.05,-4.19 -0.03,-1.08 -0.22,-2.69 -0.53,-4.84 -0.32,-2.16 -0.76,-3.94 -1.29,-5.38 -0.54,-1.43 -1.4,-3.04 -2.58,-4.84 -1.19,-1.79 -2.62,-3.24 -4.3,-4.35 -1.68,-1.11 -3.84,-2.04 -6.45,-2.79 -2.62,-0.76 -5.57,-1.13 -8.88,-1.13 -1.86,0 -3.47,0.69 -4.84,2.05 -1.43,1.43 -2.65,3.23 -3.66,5.37 -1,2.15 -1.7,4.01 -2.1,5.59 -0.39,1.57 -0.84,3.76 -1.34,6.56 -0.65,3 -1.13,5.17 -1.45,6.5 -0.32,1.32 -0.95,3.06 -1.89,5.21 -0.93,2.16 -2.04,3.87 -3.34,5.16 -2.36,2.37 -5.98,6.67 -10.86,12.9 -3.52,4.6 -7.14,8.93 -10.86,13.01 -3.73,4.09 -6.46,6.2 -8.18,6.35 -1.79,0.14 -3.34,0.88 -4.63,2.2 -1.29,1.33 -1.94,2.89 -1.94,4.68l0 68.94c0,1.85 0.69,3.46 2.05,4.78 1.36,1.33 2.97,2.03 4.84,2.1 2.51,0.07 8.17,1.65 16.99,4.74 5.52,1.86 9.84,3.28 12.96,4.24 3.11,0.97 7.47,2.01 13.06,3.12 5.58,1.11 10.75,1.66 15.48,1.66l1.82 0 8.18 0 3.87 0c9.54,-0.14 16.59,-2.94 21.18,-8.39 4.16,-4.95 5.92,-11.43 5.27,-19.47 2.8,-2.65 4.74,-6.02 5.81,-10.11 1.22,-4.36 1.22,-8.56 0,-12.58 3.3,-4.36 4.84,-9.28 4.63,-14.73 0.01,-2.3 -0.53,-5.02 -1.6,-8.18z"/><path style="fill:#05439D" d="M37.85 68.83l-30.97 0c-1.86,0 -3.49,0.68 -4.85,2.04 -1.36,1.36 -2.04,2.97 -2.04,4.84l0 68.83c0,1.86 0.68,3.48 2.04,4.84 1.37,1.36 2.98,2.05 4.85,2.05l30.97 0c1.86,0 3.48,-0.69 4.84,-2.05 1.36,-1.36 2.04,-2.97 2.04,-4.84l0 -68.83c0,-1.86 -0.68,-3.48 -2.04,-4.84 -1.36,-1.36 -2.97,-2.04 -4.84,-2.04zm-12.37 66.83c-1.36,1.32 -2.97,1.99 -4.84,1.99 -1.94,0 -3.57,-0.67 -4.89,-1.99 -1.33,-1.33 -2,-2.96 -2,-4.9 0,-1.86 0.67,-3.48 2,-4.84 1.32,-1.36 2.95,-2.04 4.89,-2.04 1.86,0 3.48,0.68 4.84,2.04 1.36,1.36 2.05,2.97 2.05,4.84 0,1.94 -0.69,3.57 -2.05,4.9z"/></g></svg>',
            }));
        else
            like_div.append($('<button/>', {
                'html': '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 163.18 167.86"><g id="like"><path style="fill:#05439D" d="M158.28 114.12c3.44,-4.39 5.08,-9.09 4.87,-13.94 -0.21,-5.33 -2.59,-9.52 -4.56,-12.07 2.28,-5.7 3.16,-14.64 -4.47,-21.59 -5.58,-5.09 -15.05,-7.38 -28.18,-6.74 -9.23,0.42 -16.96,2.14 -17.27,2.21l-0.04 0.01c-1.75,0.33 -3.62,0.71 -5.52,1.13 -0.14,-2.26 0.26,-7.83 4.4,-20.39 4.91,-14.96 4.63,-26.41 -0.91,-34.05 -5.83,-8.04 -15.13,-8.68 -17.87,-8.68 -2.63,0 -5.05,1.09 -6.76,3.09 -3.9,4.53 -3.45,12.88 -2.95,16.75 -4.63,12.42 -17.61,42.9 -28.6,51.34 -0.21,0.14 -0.39,0.32 -0.56,0.5 -3.24,3.41 -5.41,7.09 -6.88,10.32 -2.07,-1.12 -4.42,-1.75 -6.95,-1.75l-21.42 0c-8.06,0 -14.6,6.57 -14.6,14.61l0 57.04c0,8.07 6.57,14.6 14.6,14.6l21.41 0c3.13,0 6.04,-0.98 8.43,-2.66l8.25 0.98c1.26,0.18 23.73,3.02 46.79,2.56 4.18,0.32 8.11,0.5 11.76,0.5 6.29,0 11.76,-0.5 16.32,-1.48 10.74,-2.28 18.08,-6.84 21.8,-13.55 2.84,-5.13 2.84,-10.21 2.39,-13.44 6.99,-6.32 8.22,-13.31 7.97,-18.22 -0.14,-2.83 -0.77,-5.26 -1.44,-7.05zm-143.68 42.9c-2.84,0 -5.12,-2.32 -5.12,-5.12l0 -57.07c0,-2.85 2.32,-5.13 5.12,-5.13l21.41 0c2.85,0 5.13,2.32 5.13,5.13l0 57.04c0,2.84 -2.32,5.12 -5.13,5.12l-21.41 -0.01 0 0.04zm134.69 -47c-1.48,1.55 -1.75,3.89 -0.63,5.71 0,0.04 1.44,2.5 1.61,5.86 0.25,4.6 -1.96,8.68 -6.61,12.14 -1.64,1.26 -2.32,3.44 -1.61,5.41 0,0.04 1.51,4.66 -0.95,9.05 -2.35,4.22 -7.59,7.23 -15.51,8.91 -6.36,1.37 -15,1.61 -25.59,0.77 -0.14,0 -0.32,0 -0.5,0 -22.57,0.5 -45.38,-2.46 -45.63,-2.49l-0.02 0 -3.55 -0.42c0.21,-0.98 0.32,-2.03 0.32,-3.09l0 -57.07c0,-1.52 -0.25,-2.99 -0.66,-4.36 0.63,-2.35 2.39,-7.59 6.53,-12.03 15.77,-12.5 31.17,-54.65 31.83,-56.47 0.28,-0.73 0.35,-1.55 0.21,-2.35 -0.59,-3.94 -0.39,-8.75 0.46,-10.18 1.86,0.04 6.88,0.56 9.89,4.73 3.58,4.95 3.44,13.8 -0.42,25.51 -5.89,17.87 -6.39,27.28 -1.71,31.42 2.32,2.08 5.4,2.19 7.66,1.37 2.14,-0.5 4.17,-0.91 6.1,-1.23 0.14,-0.04 0.32,-0.07 0.46,-0.11 10.78,-2.35 30.08,-3.78 36.79,2.33 5.69,5.19 1.64,12.07 1.19,12.81 -1.3,1.96 -0.91,4.53 0.84,6.1 0.04,0.04 3.71,3.52 3.89,8.18 0.14,3.12 -1.34,6.32 -4.39,9.48z"/></g></svg>',
                'data-comment_id': comment['id'],
                'data-paragraph_id': comment['entity_id'],
                'data-document_id': comment['document_id'],
                'onClick': comment['is_hidden'] ? '' : 'supportComment(this)'
            }));

        if ($('#c-form-summer-note').length && !comment['is_hidden']) { // agar comment yozishga ruxsat bo'lsa
            reply_div_btn = $('<div>', {
                class: 'add_comment',
                html: $('<button/>', {
                    type: 'button',
                    'data-comment_id': comment['id'],
                    'data-entity_id': comment['document_id'],
                    'data-document_id': comment['document_id'],
                    'data-parent_id': comment['id'],
                    text: wordList.reply_btn_text[lang],
                    onClick: 'showReplyTextarea(this)'
                })
            });
            reply_text_area = $('<div />', {
                id: 'show_textarea_com-' + comment['id']
            })
        }

    } else {

        like_div.append($('<button/>', {
            html: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 163.18 167.86"><g id="like"><path style="fill:#05439D" d="M158.28 114.12c3.44,-4.39 5.08,-9.09 4.87,-13.94 -0.21,-5.33 -2.59,-9.52 -4.56,-12.07 2.28,-5.7 3.16,-14.64 -4.47,-21.59 -5.58,-5.09 -15.05,-7.38 -28.18,-6.74 -9.23,0.42 -16.96,2.14 -17.27,2.21l-0.04 0.01c-1.75,0.33 -3.62,0.71 -5.52,1.13 -0.14,-2.26 0.26,-7.83 4.4,-20.39 4.91,-14.96 4.63,-26.41 -0.91,-34.05 -5.83,-8.04 -15.13,-8.68 -17.87,-8.68 -2.63,0 -5.05,1.09 -6.76,3.09 -3.9,4.53 -3.45,12.88 -2.95,16.75 -4.63,12.42 -17.61,42.9 -28.6,51.34 -0.21,0.14 -0.39,0.32 -0.56,0.5 -3.24,3.41 -5.41,7.09 -6.88,10.32 -2.07,-1.12 -4.42,-1.75 -6.95,-1.75l-21.42 0c-8.06,0 -14.6,6.57 -14.6,14.61l0 57.04c0,8.07 6.57,14.6 14.6,14.6l21.41 0c3.13,0 6.04,-0.98 8.43,-2.66l8.25 0.98c1.26,0.18 23.73,3.02 46.79,2.56 4.18,0.32 8.11,0.5 11.76,0.5 6.29,0 11.76,-0.5 16.32,-1.48 10.74,-2.28 18.08,-6.84 21.8,-13.55 2.84,-5.13 2.84,-10.21 2.39,-13.44 6.99,-6.32 8.22,-13.31 7.97,-18.22 -0.14,-2.83 -0.77,-5.26 -1.44,-7.05zm-143.68 42.9c-2.84,0 -5.12,-2.32 -5.12,-5.12l0 -57.07c0,-2.85 2.32,-5.13 5.12,-5.13l21.41 0c2.85,0 5.13,2.32 5.13,5.13l0 57.04c0,2.84 -2.32,5.12 -5.13,5.12l-21.41 -0.01 0 0.04zm134.69 -47c-1.48,1.55 -1.75,3.89 -0.63,5.71 0,0.04 1.44,2.5 1.61,5.86 0.25,4.6 -1.96,8.68 -6.61,12.14 -1.64,1.26 -2.32,3.44 -1.61,5.41 0,0.04 1.51,4.66 -0.95,9.05 -2.35,4.22 -7.59,7.23 -15.51,8.91 -6.36,1.37 -15,1.61 -25.59,0.77 -0.14,0 -0.32,0 -0.5,0 -22.57,0.5 -45.38,-2.46 -45.63,-2.49l-0.02 0 -3.55 -0.42c0.21,-0.98 0.32,-2.03 0.32,-3.09l0 -57.07c0,-1.52 -0.25,-2.99 -0.66,-4.36 0.63,-2.35 2.39,-7.59 6.53,-12.03 15.77,-12.5 31.17,-54.65 31.83,-56.47 0.28,-0.73 0.35,-1.55 0.21,-2.35 -0.59,-3.94 -0.39,-8.75 0.46,-10.18 1.86,0.04 6.88,0.56 9.89,4.73 3.58,4.95 3.44,13.8 -0.42,25.51 -5.89,17.87 -6.39,27.28 -1.71,31.42 2.32,2.08 5.4,2.19 7.66,1.37 2.14,-0.5 4.17,-0.91 6.1,-1.23 0.14,-0.04 0.32,-0.07 0.46,-0.11 10.78,-2.35 30.08,-3.78 36.79,2.33 5.69,5.19 1.64,12.07 1.19,12.81 -1.3,1.96 -0.91,4.53 0.84,6.1 0.04,0.04 3.71,3.52 3.89,8.18 0.14,3.12 -1.34,6.32 -4.39,9.48z"/></g></svg>',
            'data-toggle': "modal",
            'data-target': "#login-modal",
        }));

        reply_div_btn = $('<div>', {
            class: 'add_comment',
            html: $('<button/>', {
                type: 'button',
                text: wordList.reply_btn_text[lang],
                'data-toggle': "modal",
                'data-target': "#login-modal",
            })
        });
    }

    like_div.append($('<i/>', {
        id: 'c-c-' + comment['id'],
        html: comment['support_count']
    }));

    let downloadBtn;

    if (comment['file']) {
        downloadBtn = $('<a />', {
            href: window.location.origin + userData['baseUrl'] + '/' + lang +
                '/download/dc-f?c=' + comment['id'] +
                '&d=' + comment['document_id'] +
                '&f=' + comment['file'],
            class: 'dc-f',
            html: '<span class="glyphicon glyphicon-download"></span>&nbsp;' + wordList.dcf[lang],
            target: '_blank'
        });
    }

    li.append(like_div, reply_div_btn, downloadBtn, reply_text_area);

    comment['authority_answers'].map(answer => {
        $('<div>', {
            class: 'their_text org_text',
            html: $('<div>', {
                class: 'text_write',
                html: '<p class="reject">' + wordList.denied_comment[lang] + '</p>' + answer['content'],
            }).append($('<div>', {
                class: 'their_name',
                html: '<span>' + answer['authority'] + '</span><span class="comment_date">' + answer['created_at'] + '</span>',
            }))
        }).appendTo(li)
    });

    comment['user_answers'].map(answer => generateReplyCommentHtml(answer).appendTo(li));

    return li;
};


const increaseHtmlValue = targetNode => targetNode.html(parseInt(targetNode.text()) + 1);


const showReplyTextarea = (btn) => {

    let data = $(btn).data();

    let textArea = $('<textarea/>', {id: 'reply-text-area-' + data['comment_id']});

    let sendReplyBtn = $('<button/>', {
        type: 'button',
        'data-comment_id': data['comment_id'],
        'data-entity_id': data['document_id'],
        'data-document_id': data['document_id'],
        'data-parent_id': data['comment_id'],
        'data-u_s_i': '',
        class: 'send-reply-btn blue_link pull-right',
        text: wordList.reply_btn_text[lang],
        onClick: 'sendReply(this)'
    });

    $('#show_textarea_com-' + data['comment_id']).html(textArea).append(sendReplyBtn);

};


const sendReply = (btn) => {
    let data = $(btn).data();
    let textarea = $('#reply-text-area-' + data['comment_id']);
    let commentText = textarea.val();
    if (!commentText) {
        alert(wordList.textIsEmpty[lang]);
        return false;
    }

    data['content'] = commentText;

    $.ajax({
        url: ajaxControllerUrl('send-comment'),
        type: 'POST',
        data: data,
        success: (response) => {
            if (response['status']) {
                textarea.val(null);
                data['id'] = response['data']['id'];
                data['created_at'] = response['data']['created_at'];
                data['full_name'] = response['data']['full_name'];
                data['special'] = response['data']['special'];

                let parentLi = textarea.parent().parent();
                let newReply = generateReplyCommentHtml(data);
                parentLi.append(newReply);
            } else {
                console.log(response['statusText']);
                alert(response['alertText']);
            }
        },
        error: error => console.log('error', error)
    });
};


const generateReplyCommentHtml = (comment) => {

    //let special = comment['special'] ? ' - (' + comment['special'] + ')' : ' ';
    let special = '';
    let blockClass = 'answer_box';
    let authority_desc = '';
    let content = comment['content'];

    if (comment['is_hidden']) {
        let reason_to_hide = comment['reason_to_hide'] ? '<div class="reason_to_hide"><b>' + wordList.hidden_description[lang] + ': </b>' + comment['reason_to_hide'] + '</div>' : '';
        blockClass += ' hidden_block';
        content = '<p class="hidden_comment">' + wordList.hidden_comment[lang] + '</p><p>' + content + '</p>';
        authority_desc = '<div class="their_name"><span>' + $('#authority-title').text() + '</span></div>' + reason_to_hide;
    }

    return $('<div />', {
        id: 'answer-box-' + comment['id'],
        class: blockClass,
        html: content
    }).append($('<div />', {
        class: 'their_name',
        html: '<span>' + comment['full_name'] + special + '</span><span class="comment_date">' + comment['created_at'] + '</span>'
    })).append(authority_desc)

};


/** Function for voting, !important */
const handleTextRadio = (question_id, answer_id, status) => {
    if (status) {
        $('#question-' + question_id + '-' + answer_id + '-textarea').show()
    } else {
        $('.textarea-radio-' + question_id).val('').hide()
    }
};


/** Nice scroll run */
$("#scroll_vertical").niceScroll({
    cursorcolor: "#CDCDCD!important",
    cursorwidth: "5",
    cursoropacitymin: 1,
    scrollTop: 0,
    cursorborder: "none",
    background: "#E1E1E1",
    cursorborderradius: 5
});


$('#comment-form').submit(function (e) {
    e.preventDefault();
    let editor = $('#c-form-summer-note');
    if (editor.summernote('isEmpty')) {
        alert(wordList.textIsEmpty[lang]);
        e.preventDefault();
        return false;
    }
    let form = new FormData(this);
    let data = $('.submit-comment').data();
    $('#comment-file-input').fileinput('clear');
    data['content'] = editor.summernote('code');
    editor.summernote('reset');

    form.append('document_id', data['document_id']);
    form.append('entity_id', data['entity_id']);
    form.append('content', data['content']);

    $.ajax({
        url: ajaxControllerUrl('send-comment-file'),
        type: 'POST',
        data: form,
        processData: false,
        contentType: false,
        beforeSend: () => {
            $('.submit-comment').attr('disabled', true).addClass('disabled');
        },
        success: (response) => {
            if (response['status']) {
                data['id'] = response['data']['id'];
                data['created_at'] = response['data']['created_at'];
                data['full_name'] = response['data']['full_name'];
                data['special'] = response['data']['special'];
                data['file'] = response['data']['file'];
                data['support_count'] = 0;
                data['authority_answers'] = [];
                data['user_answers'] = [];
                let commentTextUl = $('.comment-area-' + data['document_id']);
                commentTextUl.append(generateCommentHtml(data));
                commentTextUl.scrollTop(commentTextUl.prop("scrollHeight"));
                increaseHtmlValue($('.all-comments-count-top'));
                increaseHtmlValue($('.all-comments-count-bottom'));
                $('.no_comment').hide();
                $('.submit-comment').attr('disabled', false).removeClass('disabled');
            } else {
                console.log(response['statusText']);
                alert(response['alertText']);
            }
        },
        error: error => console.log('error', error)
    });

});

