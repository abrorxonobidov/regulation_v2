wordList.detailed = {
    ru: 'Подробно',
    uz: 'Батафсил',
    oz: 'Batafsil'
};


const gTD = (i) => {
    let w = i.html();
    let langCode = i.parents('.tab_content_in').data('langCode');
    i.attr('onclick', '');
    $.ajax({
        data: {
            word: w.trim(),
            lang: langCode
        },
        url: ajaxControllerUrl('term-desc'),
        success: r => {
            let c = '';
            r.map((a, k) => {
                if (a['l']) {
                    c += '<b>' + (k + 1) + '.&nbsp;</b>' +
                        w.toUpperCase() + ' - ' +
                        a['d'].substring(a['d'].lastIndexOf(' '), 0) +
                        "&nbsp;...<p class='text-right'>" +
                        "<a href='" + window.location.origin + userData['baseUrl'] + "/" + lang + "/site/t-d?w=" + w.trim() + "&l=" + langCode + "' class='btn btn-primary btn-sm' target='_blank'> " +
                        wordList.detailed[lang] +
                        "</a>" +
                        "</p>";
                } else {
                    c += '<b>' + (k + 1) + '.&nbsp;</b>' + w.toUpperCase() + ' - ' + a['d'] + '<br>'
                }
            });
            i.popover({
                toggle: 'popover',
                trigger: 'focus',
                placement: 'top',
                content: c,
                container: 'body',
                html: true
            });
            i.popover('show');
        },
        error: e => console.log(e)
    });
};

$(document).ready(function () {

    String.prototype.repStr = function (p) {
        let rS = this;
        p.map(pair => {
            rS = rS.replace(
                new RegExp('(( )' + pair['t'] + ')', 'i'),
                '<a class="popover_style" onclick="gTD($(this))" role="button" tabindex="0">$1</a>'
            );
        });
        return rS;
    };

    const getTerms = (l) => {
        $.ajax({
            data: {lang: l},
            url: ajaxControllerUrl('terms'),
            success: r => {
                localStorage.setItem('termsList_' + l, JSON.stringify(r));
                let timer = new Date();
                timer.setMinutes(timer.getMinutes() + 1);
                localStorage.setItem('timer__termsList_' + l, timer.toString());
                rWA(r, l);
            },
            error: e => console.log(e)
        });
    };

    const rWA = (r, l) => {
        if (r.length) {
            let wA = $('#tab-' + l + '.tab_content_in');
            let oH = wA.html();
            wA.html(oH.repStr(r));
        }
    };

    $('#doc-text-tab a[data-toggle="tab"]').on('shown.bs.tab', e => {
        initReplace($(e.target));
    });

    const initReplace = lTag => {
        let l = lTag.data('langCode');
        if (l) {
            let r = localStorage.getItem('termsList_' + l);
            if (r) rWA(JSON.parse(r), l);
            else getTerms(l);
            lTag.data('langCode', '');
        }
    };

    initReplace($('#doc-text-tab li.active a'));

    let checkLocalStorage = () => {
        for (let a in {...localStorage})
            if (a.indexOf('timer__') !== -1)
                if (new Date(localStorage[a]) < new Date()) {
                    let key = a.split('__')[1];
                    localStorage.removeItem(a);
                    localStorage.removeItem(key)
                }
        setTimeout(checkLocalStorage, 1800000); /* 30 minutes */
    };

    setTimeout(checkLocalStorage, 1800000); /* 30 minutes */

});