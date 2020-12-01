$(document).ready(function () {

    /** Vote scripts Abrorxon */
    $('.vote-form').submit(function (e) {

        let form = $(this);
        let modalId = form.data('id');

        $.ajax({
            url: ajaxControllerUrl('vote'),
            type: 'POST',
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function (response) {
                if (response['status']) {
                    $('.vote-form').each(function () {
                        this.reset();
                    });
                    $('#' + modalId).modal('hide');
                    increaseHtmlValue($('#count-' + modalId));
                    alert(response['alertText']);
                } else {
                    form.addClass('has-error');
                    $('#error-summary-' + modalId).text(response['alertText'])
                }
            },
            error: function (error) {
                console.log(error)
            }
        });
        e.preventDefault();
    }).on('change', function () {
        let form = $(this);
        let modalId = form.data('id');
        form.removeClass('has-error');
        $('#error-summary-' + modalId).text(null);
    });
    /** END Vote scripts Abrorxon */


    /** Favourite document scripts Abrorxon */
    $('.favouriteButton').on('click', function () {
        let button = $(this);
        let data = button.data();
        let loaderParent = $('#loaderParent');
        let imageSelect = button.find('img#image-select');
        let imageSelected = button.find('img#image-selected');
        $.ajax({
            url: ajaxControllerUrl('favourite'),
            type: 'POST',
            data: data,
            beforeSend: () => {
                button.hide();
                loaderParent.show();
            },
            success: response => {
                if (response['status'])
                    if (response['isAdded']) {
                        imageSelect.hide();
                        imageSelected.show();
                    } else {
                        imageSelect.show();
                        imageSelected.hide();
                    }
                else
                    alert(response['alertText']);
                loaderParent.hide();
                button.show();
            },
            error: error => console.log(error)
        });
    });
    /** END Favourite document scripts Abrorxon */


    /** Remove favourite document scripts Abdulazizhuja */
    $('.rm_favourite').on('click', function () {
        let link = $(this);
        let parentDiv = '#doc-' + link.data('document_id');
        $.ajax({
            url: ajaxControllerUrl('favourite'),
            type: 'POST',
            data: link.data(),
            success: function (response) {
                if (response['status']) {
                    if (!response['isAdded'])
                        $(parentDiv).hide('slow');
                } else
                    alert(response['alertText']);
            },
            error: error => console.log(error)
        });
    });
    /** End Remove favourite*/


    /** Document/index mini filter scripts */
    $('#mini-search-form').on('change', function () {
        let year = this.elements.year.value;
        let month = this.elements.month.value;
        let input_range = $('#globalsearch-publication_at_range');
        let grid = $('#global-search-grid-view');
        if (year && month) {
            input_range.val(year + '-' + month + '-01 - ' + year + '-' + month + '-' + new Date(year, month, 0).getDate());
            grid.yiiGridView('applyFilter');
        } else if (!(year + month)) {
            input_range.val('');
            grid.yiiGridView('applyFilter');
        }
    });
    /** END Document/index mini filter scripts */

    $('#filter-doc-type-group-ind a[data-toggle="tab"]').on('shown.bs.tab', e => {
        $('#globalsearch-document_type_id').val($(e.target).data('type_id'));
        $('#global-search-grid-view').yiiGridView('applyFilter');
    });

    /** User specialization */
    $('#spec-form').on('beforeSubmit', function () {
        $.ajax({
            type: "POST",
            data: $(this).serialize(),
            url: ajaxControllerUrl('specialization'),
            success: response => {
                $(this).addClass(response['status'] ? 'has-success' : 'has-error');
                $(this).find('.help-block').text(response['alertText']);
            },
            error: error => console.log(error)
        });
    }).submit((e) => {
        e.preventDefault()
    });
    /** END User specialization */


    /** Anonymous scripts */
    $('.answer_list .no_name_class span').click(() => {
        let loader = $('.anonymous-loader');
        $.ajax({
            url: ajaxControllerUrl('anonymous'),
            beforeSend: () => loader.show(),
            success: response => {
                if (response['status']) {
                    if (response['is_anonymous']) {
                        $('.answer_list .no_name_class').addClass('active');
                    } else {
                        $('.answer_list .no_name_class').removeClass('active');
                    }
                } else {
                    alert(response['alertText']);
                    console.log(response['statusText']);
                }
                loader.hide()
            },
            error: error => console.log(error)
        });
    });


    /** Global search form, profile search form */
    $('#global-search-form, #profile-search-form').change(e => {
        $(e.currentTarget).submit();
    });


    $('.GetVOte').on('click', e => {
        let a = $(e.target);
        if (a.data('in-process') === 1) return false;
        a.data('in-process', 1);
        $.ajax({
            url: ajaxControllerUrl('get-vote-answers'),
            type: 'POST',
            data: a.data(),
            success: data => {
                $('.answers_modal').html(data);
                $('#voteAnswerModal').modal('show');
                a.data('in-process', 0);
            },
            error: e => console.log(e)
        });
    });

    /** Closes Flash successful alerts after 3 seconds*/
    setTimeout(() => { $('#flash-alert-success').alert('close'); }, 5000);

});