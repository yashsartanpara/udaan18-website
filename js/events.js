Handlebars.registerHelper('succ', function (index) {
    return index + 1
});

Handlebars.registerHelper('urlencode', function (str) {
    return encodeURIComponent(str);
});

$(function () {
    $('#nontechEvents').html(events.map(function (event, index) {
        return '<div class="col-sm-4 col-xs-12 center-xs event-name" data-index="' + index + '">' + event.name + '</div>'
    }));
    $('#events').html(events.map(function (event, index) {
        return '<li style="padding: 0 10px;"' +
            '" class="event-name" data-index="' + index + '">' + event.name + '</li>'
    }));
    $('.event-name').click(function () {
        openEventModal(this);
    });
    $('.head-title').click(function () {
        openHeadsModal();
    });
});

window.onhashchange = function () {
    if (location.hash == '') closeEventModal();
    else populateModal(location.hash.substr(7))
};

function openEventModal(elem) {
    var index = $(elem).data('index');
    window.location.hash = 'event-' + index;
}

function closeEventModal() {
    var modal = $('#event-modal')
        .removeClass('modal-open-animation')
        .addClass('modal-close-animation');
    setTimeout(function () {
        modal.css('display', 'none');
    }, 500)
}

function populateModal(index) {
    $('#event-modal')
        .html(Handlebars.templates['event'](events[index]))
        .removeClass('modal-close-animation')
        .css('display', 'block')
        .addClass('modal-open-animation');
    $('.close').on('click', function () {
        history.back()
    });
}

function openHeadsModal() {
    $('#heads-modal')
        .html(Handlebars.templates['heads'](heads))
        .removeClass('modal-close-animation')
        .css('display', 'block')
        .addClass('modal-open-animation');
    $('.close').on('click', function () {
        closeHeadsModal()
    });
}
function closeHeadsModal() {
    var modal = $('#heads-modal')
        .removeClass('modal-open-animation')
        .addClass('modal-close-animation');
    setTimeout(function () {
        modal.css('display', 'none');
    }, 500)
}


$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        closeEventModal()
    }
});
