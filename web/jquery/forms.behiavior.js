Twig.setFilter("trans", function (id, params, domain, locale) {

    params = params || {};

    // normalizes params (removes placeholder prefixes and suffixes)
    for (var key in params) {
        if (params.hasOwnProperty(key) &&
            key[0] == Translator.placeHolderPrefix &&
            key[key.length - 1] == Translator.placeHolderSuffix) {
            params[key.substr(1, key.length - 2)] = params[key];
            delete params[key];
        }
    }

    return Translator.trans(id, params, domain, locale);
});
// --------------------------------------------
// ----------------- Variables
// --------------------------------------------
// Comportement pour les images dans les formulaires
// Récupère le div qui contient la collection de tags
var collectionHolder = $('ul.images');

var url = $(location).attr('href').split('/');

// The current eventId loaded
var selectedEventKey = 0;
var eventCount = $('.eventItem').length;

// ajoute un lien « add a tag »
var $addImageLink = $('<a href="#" class="add_image_link">Ajouter une image</a>');
var $newLinkLi = $('<li></li>').append($addImageLink);
// --------------------------------------------
// ----------------- Functions
// --------------------------------------------
function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1];
        }
    }
}

function GetURLHash() {
    var sPageHash = window.location.hash.split('=')[1];
    return sPageHash;
}

function toggleRules(p_time) {
    var time = typeof p_time !== 'undefined' ? p_time : 0;
    if ($('#rfc_corebundle_championship_isAgreed').is(':checked')) {
        $('#rfc_corebundle_championship_listRules').prop('selectedIndex', -1);
        $('#rfc_corebundle_championship_listRules').parent('div').hide(time);
    } else {
        $('#rfc_corebundle_championship_listRules').parent('div').show(time);
    }
}

function getChampionshipResults(championshipId) {
    var data = {
        'championshipId': championshipId
    };
    var jsonFormatted = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_championship_getResults'),
        data: jsonFormatted,
        cache: false
    }).done(function (data) {
        addNotification('Championship results updated', 'success');
        $('.ui.globalResults.modal').remove();
        $('#globalResults').html(data);
        $('.uiTabs .item').tab();
        $('#viewFullLeaderboard').bind('click', function () {
            showModalAndActivatePopups($('.standard.globalResults.modal'));
        });
    }).fail(
        function (jqXHR, textStatus, errorThrown) {
            addNotification('Error while updating championship\'s results',
                'error');
        });

    return false;
}

function getEventResult(eventId) {
    var data = {
        'eventId': eventId
    };
    var jsonFormatted = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_event_getResults'),
        data: jsonFormatted,
        cache: false
    }).done(function (data) {
        addNotification('Event results updated', 'success');
        $('div.eventResults[data-eventid="' + eventId + '"').find('.description').html(data);
    }).fail(
        function (jqXHR, textStatus, errorThrown) {
            addNotification('Error while updating event\'s results',
                'error');
        });
}

/**
 * This method returns if we are on current page based on URL.
 * It needs to have both slashes at left and right of the page tested.
 * Ex: isCurrentPage('Championship') returns true if we are in http://URL/Championship/2
 * also, returns false if http://URL/Championship
 * @param {type} pageName the name we want to retrieve from the URL.
 * @returns {Boolean} true if pageName found in URL and false if not
 */
function isCurrentPage(pageName) {
    var regexp = new RegExp("/" + pageName + "/");
    if (regexp.test($(location).attr('href'))) {
        return true;
    } else {
        return false;
    }
}

/*
 * Returns the results for the current championship (fetched by the URL)
 */
function getCurrentChampionshipResults() {
    var regexp = /\/Championship\/\d*/;
    var match;
    if (regexp.test($(location).attr('href'))) {
        match = regexp.exec($(location).attr('href'));
        getChampionshipResults(match[0].split("/")[2]);
    }
}

function reportIssueToGitHub(data) {
    var jsonFormatted = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_core_reportIssue'),
        data: jsonFormatted,
        dataType: 'html',
        cache: false
    }).done(function (data) {
        $('#reportIssuePopup div.description').html(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#reportIssuePopup div.description').html("Error while sending the issue");
    });
}

function crewApplyRequest(data) {
    var jsonFormatted = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_crew_application'),
        data: jsonFormatted,
        dataType: 'json',
        cache: false
    }).done(function (data) {
        addNotification('Application completed', 'success');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        addNotification('Error while applying crew', 'error');
        $('form#sendCrewApplication button').removeClass('ym-disabled');
        $('form#sendCrewApplication button').prop('disabled', false);
    });
}

function crewDeclineRequest(data) {
    var jsonFormatted = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_crew_retire'),
        data: jsonFormatted,
        dataType: 'json',
        cache: false
    }).done(function (data) {
        addNotification('Crew retirement completed', 'success');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        addNotification('Error while retiring from crew', 'error');
        $('form#acceptCrewApplication button').removeClass('ym-disabled');
        $('form#declineCrewApplication button').removeClass('ym-disabled');
        $('form#cancelCrewRequest button').removeClass('ym-disabled');
        $('form#acceptCrewApplication button').prop('disabled', false);
        $('form#declineCrewApplication button').prop('disabled', false);
        $('form#cancelCrewRequest button').prop('disabled', false);
    });
}

function crewAcceptRequest(data) {
    var jsonFormatted = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_crew_accept'),
        data: jsonFormatted,
        dataType: 'json',
        cache: false
    }).done(function (data) {
        addNotification('Crew acceptation completed', 'success');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        addNotification('Error while accepting member to crew', 'error');
        $('form#acceptCrewApplication button').removeClass('disabled');
        $('form#declineCrewApplication button').removeClass('disabled');
        $('form#acceptCrewApplication button').prop('disabled', false);
        $('form#declineCrewApplication button').prop('disabled', false);
    });
}

function updateProperties(data) {
    var jsonFormatted = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_properties_update'),
        data: jsonFormatted,
        dataType: 'json',
        cache: false
    }).done(function (data) {
        // show messages
        addNotification('Properties updated', 'success');
        $('form.system-properties button').removeClass('disabled');
        $('form.system-properties button').removeClass('disabled');
        $('form.system-properties button').prop('disabled', false);
        $('form.system-properties button').prop('disabled', false);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        var msg = '';
        if (jqXHR && jqXHR.responseText) { // ajax error, errors = xhr object
            msg = jqXHR.responseText;
        } else { // validation error (client-side or server-side)
            $.each(errors, function (k, v) {
                msg += k + ": " + v + "<br />";
            });
        }
        addNotification('Error while saving properties : ' + msg, 'error');
        $('form.system-properties button').removeClass('disabled');
        $('form.system-properties button').removeClass('disabled');
        $('form.system-properties button').prop('disabled', false);
        $('form.system-properties button').prop('disabled', false);
    });
}

function loadSessionData(data) {
    var jsonFormatted = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_session_load'),
        data: jsonFormatted,
        cache: false,
        beforeSend: function () {
            $('.ui.standard.session.modal.transition >.content >.description').html("Chargement de la session...");
            //$('#session').html("Chargement de la session...");
        }
    }).done(function (data) {
        addNotification('Session loaded', 'success');
        $('.ui.standard.session.modal.transition >.content >.description').html(data);
        //$('#session').html(data);
        $('.ui.standard.session.modal.transition >.content >.description .slickSlideshow').slick({
            autoplay: true,
            arrows: false
        });
        $('form#setResults').bind('submit', function () {
            handleSessionResults($(this));
            $('.ui.standard.session.modal').modal('hide');
            return false;
        });
        $('.standard.session.modal').modal('refresh');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('.ui.standard.session.modal.transition >.content >.description').html("Aucune session n'a pu être chargée");
        //$('#session').html("Aucune session n'a pu être chargée");
        addNotification('Error while loading session', 'error');
    });
}

function showSubStepInfo(subStepId) {
    // Hide subSteps
    $('.subStepInfo').hide();
    if (subStepId !== "") {
        $('.subStepInfo[data-substepid=' + subStepId + ']').show();
    }
}

function loadSetupStepData(data, firstElement, stepId) {
    var receiver = $('.setupStepContent[data-stepid=' + stepId + ']').find('.setupStepValues');
    var actionRoute = "";
    if (firstElement) {
        actionRoute = 'setupStep_edit';
    } else {
        actionRoute = 'setupStep_show';
    }
    var jsonFormatted = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: Routing.generate(actionRoute, data),
        data: jsonFormatted,
        cache: false,
        beforeSend: function () {
            receiver.html("Chargement de la version...");
            receiver.parent().addClass('loading');
        }
    }).done(
        function (data) {
            receiver.parent().removeClass('loading');
            addNotification('Version loaded', 'success');
            receiver.html(data);
            if (firstElement) {
                // Show subStep on select
                $('.setupStepContent #rfc_setupbundle_setupStep_subStep')
                    .unbind('change');
                $('.setupStepContent[data-stepid=' + stepId + '] .setupStepValues select')
                    .bind(
                    'change',
                    function () {
                        var selected = $(this).find(
                            'option:selected').val();
                        showSubStepInfo(selected);

                    });
                $('.setupStepContent[data-stepid=' + stepId
                    + '] .setupStepValues select').trigger('change');
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            receiver.html("Aucune version n'a pu être chargée");
            addNotification('Error while loading version', 'error');
        });
}

function selectVersion(elementSelected) {
    var stepId = elementSelected.parents('.setupStepContent').data('stepid');
    var entityData = elementSelected.find(":selected");
    var firstElement = elementSelected.find('option:first-child').val() === entityData
        .val() ? true : false;
    var data = {
        setupStepId: entityData.val(),
        gameId: entityData.data("gameid"),
        setupId: entityData.data("setupid")
    };

    loadSetupStepData(data, firstElement, stepId);
}

function showStep(stepNumber) {
    $('.setupStepContent').hide();
    $('.setupStepContent[data-stepnumber=' + stepNumber + ']').show();
    $('.setupStepSelector .step').removeClass('active');
    $('.setupStepSelector[data-stepnumber=' + stepNumber + '] .step').addClass('active');
    // version loading on select
    $('.setupStepContent .selectVersion').unbind('change');
    var select = $('.setupStepContent[data-stepnumber=' + stepNumber + '] .selectVersion');
    select.on('change', function () {
        selectVersion($(this));
    });
    select.trigger('change');
    document.location.hash = "stepNumber=" + stepNumber;
}

function setSessionResults(data) {
    var jsonFormatted = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_session_results_set'),
        data: jsonFormatted,
        cache: false,
        contentType: 'json',
        dataType: 'json',
        beforeSend: function () {
            $('#formContainer').append("Enregistrement des résultats...");
        }
    }).done(function (dataResult) {
        addNotification('Results saved', 'success');
        getCurrentChampionshipResults();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#session').html("Aucuns résultats n'a pu être enregistré");
        addNotification('Error while saving session results', 'error');
    });
}

function handleSessionResults(form) {
    var list = new Array();
    form.find('tbody tr').each(function () {
        var data;
        data = $(this).find('select').val();
        data += ',' + $(this).find('textarea').val();
        list.push(data);
    });

    var data = {
        sessionId: form.find('#sessionId').val(),
        results: list
    };
    setSessionResults(data);
}

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm)
            return i;
    }
    return -1;
}

function getDateFormatted() {
    var now = new Date();

    var annee = now.getFullYear();
    var mois = ('0' + (now.getMonth() + 1)).slice(-2);
    var jour = ('0' + now.getDate()).slice(-2);
    var heure = ('0' + now.getHours()).slice(-2);
    var minute = ('0' + now.getMinutes()).slice(-2);
    var seconde = ('0' + now.getSeconds()).slice(-2);

    return jour + "/" + mois + "/" + annee + " - " + heure + ":" + minute + ":"
        + seconde;
}

var notificationBox = $('#notificationCenter').find('#messages');
var notifications = new Array();
var lastNotificationId = 0;

function animate(element_ID, animation) {
    $(element_ID).addClass('animated ' + animation);
    $(element_ID)
        .one(
        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        function () {
            $(element_ID).removeClass('animated ' + animation);
        });
}

function addNotification(message, type) {
    var notification = new Object();
    notification.id = lastNotificationId;
    notification.date = getDateFormatted();
    notification.message = message;
    notification.type = typeof type !== 'undefined' ? type : 'info';
    notifications.push(notification);
    animate(
        $('#notificationCenter').find('.bubble').html(notifications.length),
        'bounce');
    var icon = "";
    switch (type) {
        case 'info':
            icon = "<i class=\"ym-spark\"></i>";
            break;
        case 'warning':
            icon = "<i class=\"ym-star\"></i>";
            break;
        case 'success':
            icon = "<i class=\"ym-save\"></i>";
            break;
        case 'error':
            icon = "<i class=\"ym-delete\"></i>";
            break;
        default:
            icon = "<i class=\"ym-spark\"></i>";
            break;
    }
    $(notificationBox).append(
        "<li class=\"container-clearFix ym-clearfix\"><span class=\"left\">"
        + icon + notification.date + " - " + notification.message
        + "</span><span class=\"right\"><a href=\"#\" id=\"message"
        + notification.id
        + "\" class=\"ym-close\">&nbsp;</a></span></li>");
    $(notificationBox).find('#message' + notification.id).bind("click",
        function () {
            removeNotification(notification.id);
            return false;
        });
    lastNotificationId++;
}

function drawNotifications() {
    var htmlToDraw = "";
    for (i = 0; i < notifications.length; i++) {
        htmlToDraw += "<li class=\"container-clearFix ym-clearfix\"><span class=\"left\">"
            + icon
            + notification.date
            + " - "
            + notification.message
            + "</span><span class=\"right\"><a href=\"#\" id=\"message"
            + notification.id
            + "\" class=\"ym-close\">&nbsp;</a></span></li>";
    }
    $(notificationBox).html(htmlToDraw);
    animate(
        $('#notificationCenter').find('.bubble').html(notifications.length),
        'bounce');
    lastNotificationId = notifications.length;
}

function removeNotification(id) {
    notifications.splice(arrayObjectIndexOf(notifications, id, 'id'), 1);
    $(notificationBox).find("li").find("#message" + id).parent().parent()
        .fadeOut(300, function () {
            $(this).remove();
        });
    animate(
        $('#notificationCenter').find('.bubble').html(notifications.length),
        'fadeOut');
    if (notifications.length < 1
        && $("#notificationCenter").find("#messages").parent().is(
            ":visible")) {
        $("#notificationCenter").find("#messages").parent().slideToggle();
    }
}

function addImageFormDeleteLink($imageFormLi) {
    var $removeFormA = $('<a href="#">Supprimer cette image</a>');
    $imageFormLi.append($removeFormA);

    $removeFormA.on('click', function (e) {
        // empêche le lien de créer un « # » dans l'URL
        e.preventDefault();

        // supprime l'élément li pour le formulaire de
        // tag
        $imageFormLi.remove();
    });
}

function showModalAndActivatePopups(modalDomElement) {
    modalDomElement.modal({
        onShow: function () {
            $('.popupElement').popup();
        }
    }).modal('show');
}

function addImageForm(collectionHolder, $newLinkLi) {
    // Récupère l'élément ayant l'attribut
    // data-prototype comme expliqué
    // plus tôt
    var prototype = collectionHolder.attr('data-prototype');

    // Remplace '__name__' dans le HTML du prototype par
    // un nombre basé sur
    // la longueur de la collection courante
    var newForm = prototype.replace(/__name__/g,
        collectionHolder.children().length);

    // Affiche le formulaire dans la page dans un li,
    // avant le lien "ajouter
    // une image"
    var $newFormLi = $('<li></li>').append(newForm);
    $newLinkLi.before($newFormLi);

    // ajoute un lien de suppression au nouveau
    // formulaire
    addImageFormDeleteLink($newFormLi);
}


function updateProgressBar(progressItem) {
    var now = new Date();
    var beginDate = new Date(progressItem.data('begindate'));
    var endDate = new Date(progressItem.data('enddate'));
    var percentProgress = 0;
    if (now > beginDate.getTime() && now < endDate.getTime()) {
        percentProgress = (now.getTime() - beginDate.getTime()) / (endDate.getTime() - beginDate.getTime()) * 100;
    } else if (now.getTime() < beginDate.getTime()) {
        percentProgress = 0;
    } else if (now.getTime() > endDate.getTime()) {
        percentProgress = 100;
    }
    progressItem.progress({
        percent: percentProgress
    });
}

/**
 * Show the eventItem div
 * @param {type} id
 * @returns {undefined}
 */
function showEvent(id) {
    $('.previousEvent i').removeClass('disabled');
    $('.nextEvent i').removeClass('disabled');
    if (1 === id) {
        $('.previousEvent i').addClass('disabled');
    }
    if (id === eventCount) {
        $('.nextEvent i').addClass('disabled');
    }
    $('.eventItem').hide();
    var eventElement = $('.eventItem[data-eventkey=' + id + ']');
    eventElement.show();
    selectedEventKey = id;
    updateProgressBar(eventElement.find('.ui.progress'));
    updateProgressBar($('#championshipProgessbar'));
    loadEventSessions(eventElement.data('eventid'));
    updateSlickSlideshow(eventElement.find('.slickSlideshow'));
    getEventResult(eventElement.data('eventid'));
}

function loadEventSessions(id) {
    $('#session').html('');
    $('#sessionAddButton').hide();

    var event = $('.eventItem[data-eventid=' + id + ']');
    var data = {
        eventId: event.data('eventid'),
        gameId: event.data('gameid'),
        championshipId: event.data('championshipid')
    };
    var jsonFormatted = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: Routing.generate('admin_session_search'),
        data: jsonFormatted,
        cache: false,
        beforeSend: function () {
            $('#listSessions').html("Chargement des sessions...");
        }
    }).done(function (datareturned) {
        $('#listSessions').html(datareturned);
        $('.sessionItem').bind('click', function () {
            $('.sessionItem').removeClass('active');
            $(this).addClass("active");

            var data = {
                sessionId: $(this).data('session')
            };

            showModalAndActivatePopups($('.standard.session.modal'));
            loadSessionData(data);
            return false;
        });
        $('#sessionAddButton').attr("href", Routing.generate('admin_session_new', {
            gameId: data.gameId,
            championshipId: data.championshipId,
            eventId: data.eventId
        }));
        $('#sessionAddButton').show();
    }).fail(function () {
        $('#listSessions').html("Impossible de récupérer un résultat");
        $('#sessionAddButton').attr("href", "");
        $('#sessionAddButton').hide();
    });
    return false;
}

function userRegistrationApi() {
    $('.ui.button.userRegistration').api({
        method: 'POST',
        onSuccess: function (response) {
            var championship = $.parseJSON(response.data).championship;
            var user = $.parseJSON(response.data).user;
            var registerAction = $.parseJSON(response.data).registeraction;
            var registration = $.parseJSON(response.data).registration;
            userRegistrationRender(championship.id, user.id);
            if(!championship.teamChampionship) {
                if (registerAction === 'register') {
                    vehicleSelectionRender(championship.id, registration.id)
                    showModalAndActivatePopups($('.standard.vehicleSelection.modal'));
                }
            } else {
                teamRegistrationRender(championship.id, user.id)
                if (registerAction === 'register') {
                    vehicleSelectionRender(championship.id, registration.id)
                    showModalAndActivatePopups($('.standard.vehicleSelection.modal'));
                }
            }
        }
    });
    $('#vehicleSelectionForm').click(function() {
        showModalAndActivatePopups($('.standard.vehicleSelection.modal'));
    });
    $('#teamRegistrationForm').click(function() {
        showModalAndActivatePopups($('.standard.teamRegistration.modal'));
    });
}

/**
 * This method registers the api on the vehicle selection button
 */
function vehicleSelectionApi() {
    $('.standard.vehicleSelection.modal > .content > .segment > .description .ui.button.vehicleSelection').api({
        method: 'POST',
        onSuccess: function (response) {
            var registration = $.parseJSON(response.data).registration;
            var championship = registration.championship;
            vehicleSelectionRender(championship.id, registration.id);
            if(!championship.teamChampionship) {
                userRegistrationRender(championship.id, registration.user.id);
            } else {
                teamRegistrationRender(championship.id, registration.user.id)
            }
        }
    });
}

function userRegistrationRender(championshipId, userId) {
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_user_registration_render', { championshipId : championshipId, userId : userId}),
        cache: false,
    }).done(function (data) {
        $('#userRegistrationForm').html(data);
        userRegistrationApi();
        championshipParticipantRender(championshipId);
    });
}

function teamRegistrationRender(championshipId, userId) {
    var contentReplaced = $('.standard.teamRegistration.modal > .content > .segment > .description');
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_team_registration_render', { championshipId : championshipId, userId : userId}),
        cache: false,
        beforeSend: toggleLoading(contentReplaced, true),
    }).done(function (data) {
        contentReplaced.html(data);
        toggleLoading(contentReplaced, false)
        userRegistrationApi();
        championshipParticipantRender(championshipId);
    });
}

/**
 * This method renders the vehicle selection screen depending the given parameters.
 * If team is not null, assumes that we allow only team available vehicles and not championship available vehicles.
 * @param championship
 * @param user
 * @param team
 */
function vehicleSelectionRender(championshipId, registrationId) {
    var contentReplaced = $('.standard.vehicleSelection.modal > .content > .segment > .description');
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_vehicle_selection_render', { championshipId : championshipId, registrationId : registrationId}),
        cache: false,
        beforeSend: toggleLoading(contentReplaced, true),
    }).done(function (data) {
        contentReplaced.html(data);
        toggleLoading(contentReplaced, false)
        vehicleSelectionApi();
        championshipParticipantRender(championshipId);
    });
}

function championshipParticipantRender(championshipId) {
    var contentReplaced = $('#championship_participants');
    $.ajax({
        type: "POST",
        url: Routing.generate('ajax_championship_participants_render', { championshipId : championshipId}),
        cache: false,
    }).done(function (data) {
        contentReplaced.html(data);
    });
}

function toggleLoading(element, active) {
    var dimmer = element.parent().find('.ui.dimmer');
    if(active) {
        dimmer.addClass('active');
    } else {
        dimmer.removeClass('active');
    }

}

function updateSlickSlideshow(element) {
    element.parent().find('.slick-initialized').slick('unslick');
    element.slick({
        autoplay: true,
        arrows: false
    });
}

$(function () {

    // Screen Admin : System
    // --------------------------------------------
    // ----------------- Properties editing
    // --------------------------------------------

    $('.datetimepicker').datetimepicker({
        format: 'Y/m/d H:i',
        formatDate: 'Y/m/d H:i',
        mask: true,
        dayOfWeekStart: 1,
        validateOnBlur: false
    });
    $('.datepicker').datetimepicker({
        timepicker: false,
        format: 'Y/m/d',
        formatDate: 'Y/m/d',
        mask: true,
        dayOfWeekStart: 1,
        validateOnBlur: false
    });

    $('form.system-properties').submit(function (e) {
        var data = $(this).serializeArray();
        $(this).find('button').addClass('disabled');
        $(this).find('button').prop('disabled', true);
        updateProperties(data);
        return false;
    });

    $('form.system-properties').find('#reset-btn').click(function () {
        $(this).parent().get(0).reset();
        return false;
    });

    // Screen Core : Crew
    // --------------------------------------------
    // ----------------- Crew application
    // --------------------------------------------
    $('form#sendCrewRequest').submit(function (e) {
        var data = {
            requesterId: $(this).find('#requesterId').val(),
            managerId: $(this).find('#managerId').val(),
            gameId: $(this).find('#gameId').val()
        };
        $('form#sendCrewRequest button').addClass('disabled');
        $('form#sendCrewRequest button').prop('disabled', true);
        crewApplyRequest(data);
        return false;
    });

    $('form#cancelCrewRequest').submit(function () {
        var data = {
            crewRequestId: $(this).find('#crewRequestId').val()
        };
        $('form#cancelCrewRequest button').addClass('ym-disabled');
        $('form#cancelCrewRequest button').prop('disabled', true);
        crewDeclineRequest(data);
        return false;
    });

    // Screen Core : User
    // --------------------------------------------
    // ----------------- Crew validation
    // --------------------------------------------
    $('form#acceptCrewApplication').submit(function (e) {
        var data = {
            crewRequestId: $(this).find('#crewRequestId').val()
        };
        $('form#acceptCrewApplication button').addClass('ym-disabled');
        $('form#acceptCrewApplication button').prop('disabled', true);
        $('form#declineCrewApplication button').addClass('ym-disabled');
        $('form#declineCrewApplication button').prop('disabled', true);
        crewAcceptRequest(data);
        return false;
    });

    $('form#declineCrewApplication').submit(function (e) {
        var data = {
            crewRequestId: $(this).find('#crewRequestId').val()
        };
        $('form#acceptCrewApplication button').addClass('ym-disabled');
        $('form#acceptCrewApplication button').prop('disabled', true);
        $('form#declineCrewApplication button').addClass('ym-disabled');
        $('form#declineCrewApplication button').prop('disabled', true);
        crewDeclineRequest(data);
        return false;
    });

    // Screen Championship
    // --------------------------------------------
    // ----------------- Show events
    // --------------------------------------------

    $('.nextEvent').click(function () {
        var nextEventItem = $('.eventItem[data-eventkey=' + selectedEventKey + ']').next();
        if (nextEventItem.data('eventkey') !== undefined) {
            showEvent(nextEventItem.data('eventkey'));
            location.hash = "eventId=" + nextEventItem.data('eventid');
        }
    });

    $('.previousEvent').click(function () {
        var prevEventItem = $('.eventItem[data-eventkey=' + selectedEventKey + ']').prev();
        if (prevEventItem.data('eventkey') !== undefined) {
            showEvent(prevEventItem.data('eventkey'));
            location.hash = "eventId=" + prevEventItem.data('eventid');
        }
    });

    $('.eventQuickLinks').click(function () {
        var event = $('.eventItem[data-eventid=' + $(this).attr('href').substring(9) + ']');
        showEvent(event.data('eventkey'));
    });

    // Screen MetaRule
    // --------------------------------------------
    // ----------------- Show rules / metaRules
    // --------------------------------------------

    function updateListsHeight() {
        $('.sortable').css('height', 'auto');
        var highestListHeight = $('#list1').height() > $('#list2').height() ? $('#list1').height() : $('#list2').height();
        $('.sortable').css('height', highestListHeight);
    }

    function handleRuleDragNDrop() {
        $('.sortable').sortable({
            connectWith: ".ui .list",
            placeholder: "ui-state-highlight",
            opacity: 0.8,
            containment: '.sortableArea',
            receive: function (event, ui) {
                updateListsHeight();
            }
        });

        updateListsHeight();

        $('#saveRules').click(function () {
            elements = $('#list2 .item .header');
            var arr;
            arr = [];
            arr = $.map(elements, function (a) {
                return a.innerHTML;
            });
            alert(arr.length === 0 ? null : arr.join(','));
        });
    }

    $("div.metaRuleItem").click(function () {
        $('.metaRuleItem').removeClass('active');
        $(this).addClass("active");
        var entityData = $(this).attr('id').split(';');
        var data = {
            metaRuleId: entityData[0].substr(9),
            gameId: entityData[1].substr(5)
        };
        var jsonFormatted = JSON.stringify(data);
        $.ajax({
            type: "POST",
            url: Routing.generate('admin_rule_search'),
            data: jsonFormatted,
            cache: false,
            beforeSend: function () {
                $('#listRules').html("Chargement des règles...");
            }
        }).done(function (data) {
            $('#listRules').html(data);
            handleRuleDragNDrop();
        }).fail(function () {
            $('#listRules').html("Impossible de récupérer un résultat");
        });
        return false;
    });

    // --------------------------------------------
    // ----------------- Image collection behiavior
    // --------------------------------------------

    // ajoute un lien de suppression à tous les éléments li de formulaires de tag existants
    collectionHolder.find('li').each(function () {
        addImageFormDeleteLink($(this));
    });

    // ajoute l'ancre « ajouter un tag » et li à la balise ul
    collectionHolder.append($newLinkLi);

    $addImageLink.on('click', function (e) {
        // empêche le lien de créer un « # » dans l'URL
        e.preventDefault();

        // ajoute un nouveau formulaire tag (voir le prochain bloc de code)
        addImageForm(collectionHolder, $newLinkLi);
    });

    // --------------------------------------------
    // ----------------- Notification center
    // --------------------------------------------
    $("#notificationCenter").find("#messages").parent().hide();
    $("#notificationCenter").find(".bubble").click(function () {
        if (notifications.length > 0) {
            $("#notificationCenter").find("#messages").parent().slideToggle();
        }
        return false;
    });
    drawNotifications();

    // --------------------------------------------
    // ----------------- SetupStep
    // --------------------------------------------
    // Hide steps
    $('.setupStepContainer .setupStepContent').hide();

    $('.setupStepSelector .step').on('click', function () {
        showStep($(this).parents('.setupStepSelector').data('stepnumber'));
    });

    // Loading the page. Get if we have a step specified or default
    if (url[url.length - 3] === 'Setup' && url[url.length - 1].match(/^show/)) {
        var stepAction = GetURLHash();
        if (stepAction === undefined) {
            showStep(1);
        } else {
            showStep(stepAction);
        }
    }

    // --------------------------------------------
    // ----------------- WYSIWYG editor
    // --------------------------------------------
    //$("textarea").wysibb();

    // --------------------------------------------
    // Screen Championship creation
    // --------------------------------------------
    // Toggleing rules list
    toggleRules(0);
    $('#rfc_corebundle_championship_isAgreed').change(function () {
        toggleRules(200);
    });

    // --------------------------------------------
    // ----------------- Set tabs element as tabs
    // --------------------------------------------
    //$(".jquery_tabs").accessibleTabs();

    // --------------------------------------------
    // Screen Championship show
    // --------------------------------------------
    // Get championship results on load
    getCurrentChampionshipResults();
    // Selecting event

    if (!url[url.length - 1].match(/#eventId\=\d/)) {
        selectedEventKey = 1;
    } else {
        var eventItem = $('.eventItem[data-eventid=' + parseInt(GetURLHash()) + ']').data('eventkey');
        selectedEventKey = eventItem ? eventItem : 1;
    }

    if (isCurrentPage('Championship')) {
        showEvent(selectedEventKey);
    }

    $('#viewFullDriverList').click(function () {
        showModalAndActivatePopups($('.standard.driverList.modal'));
    });

    $('.showEventResults').click(function () {
        var eventClicked = $(this).parent().data('eventid');
        var modalPopup = $('.standard.eventResults.modal[data-eventid="' + eventClicked + '"]');
        showModalAndActivatePopups(modalPopup);
    });

    $('#viewRulesDetails').click(function () {
        showModalAndActivatePopups($('.standard.rulesDetails.modal'));
    });

    $('#showTeamList').click(function () {
        showModalAndActivatePopups($('.standard.teamList.modal'));
    });

    $('.grid.teams .card .image').dimmer({
        on: 'hover'
    });

    userRegistrationApi();
    vehicleSelectionApi();

// --------------------------------------------
// Screen MetaRule show
// --------------------------------------------
// Selecting metaRule
    $(".metaRuleItem:first").trigger("click");

// --------------------------------------------
// ----------------- popupMenu : edit element
// --------------------------------------------

    $('#showSidebar').click(function () {
        $('.sidebar.footer').sidebar('toggle');
    });

    $('#showComments.ui.button').click(function () {
        $('.sidebar.comments').sidebar('toggle');
    });

// --------------------------------------------
// ----------------- Clickable table row
// --------------------------------------------
    /*
     * $('tr').has('td').has('a').hover(function() { $(this).css('cursor',
     * 'pointer'); }); $('tr').has('td').has('a').click(function() { var href =
     * $(this).find('a').attr('href'); if (href) { window.location = href; } });
     */

    $('#userMenu').dropdown({
        on: 'hover',
        duration: 75,
        transition: 'fade down'
    });

    $('#loginButton').click(function () {
        $('#loginForm').submit();
    });

    $('.ui.card.gameCard').click(function () {
        window.location = Routing.generate('rfcCore_gameSelection', {'gameId': $(this).data('gameid')});
    });

    $('.ui.card.gameCard .extra.content a, .ui.card.gameCard .extra.content div').click(function (e) {
        e.stopPropagation();
    });

    $('#reportIssue').click(function () {
        showModalAndActivatePopups($('#reportIssuePopup.modal'));
    });

    $('form#sendIssue').submit(function (event) {
        var serializedForm = $(this).serializeArray();
        reportIssueToGitHub(serializedForm);
        event.preventDefault();
    });
});

//$('.ui.checkbox').checkbox();

$('.dropdown').not('#userMenu').dropdown();

$('.popupLabel').popup({
    inline: true
});

$('.sidebar.comments').sidebar('setting', {
    dimPage: false,
    transition: 'overlay'
});

$('.uiTabs .menu .item').tab({
    alwaysRefresh: true,
    history: true,
    historyType: 'hash'
});

$('.slick3Slideshow').slick({
    autoplay: true,
    slidesToShow: 3,
    arrows: false,
    centerMode: true
});

$('.slickSlideshow').each(function () {
    updateSlickSlideshow($(this));
});

//------------------- Championship creation 
$("#rfc_corebundle_championship_teamChampionship").change(function () {
    if ($(this).is(':checked')) {
        $("#rfc_corebundle_championship_teamCountSelection").parent().show();
        $("#rfc_corebundle_championship_teamCountSelection").val($('#rfc_corebundle_championship_teamCountSelection option:first').val());
        $("#rfc_corebundle_championship_teamCountSelection").change();
        $("#rfc_corebundle_championship_teamCount").parent().show();
        $("#rfc_corebundle_championship_MaximumMainDrivers").parent().show();
        $("#rfc_corebundle_championship_MaximumSecondaryDrivers").parent().show();
    } else {
        $("#rfc_corebundle_championship_teamCountSelection").parent().hide();
        $("#rfc_corebundle_championship_teamCount").parent().hide();
        $("#rfc_corebundle_championship_MaximumMainDrivers").parent().hide();
        $("#rfc_corebundle_championship_MaximumSecondaryDrivers").parent().hide();
    }
});

$("#rfc_corebundle_championship_teamCountSelection").change(function () {
    updateChampionshipCreationValues(0);
    switch ($(this).val()) {
        case 'byVehicles':
            $("#rfc_corebundle_championship_listVehicles").parent().show();
            $("#rfc_corebundle_championship_listVehicles").change();
            $("#rfc_corebundle_championship_listCategories").parent().hide();
            $("#rfc_corebundle_championship_teamCount").prop('readonly', true);
            break;
        case 'byCategories':
            $("#rfc_corebundle_championship_listCategories").parent().show();
            $("#rfc_corebundle_championship_listCategories").change();
            $("#rfc_corebundle_championship_listVehicles").parent().hide();
            $("#rfc_corebundle_championship_teamCount").prop('readonly', true);
            break;
        case 'byChoice':
            $("#rfc_corebundle_championship_listVehicles").parent().show();
            $("#rfc_corebundle_championship_listCategories").parent().show();
            if (null !== $("#rfc_corebundle_championship_listCategories").val()) {
                $("#rfc_corebundle_championship_listCategories").change();
            } else if (null !== $("#rfc_corebundle_championship_listVehicles").val()) {
                $("#rfc_corebundle_championship_listVehicles").change();
            }
            $("#rfc_corebundle_championship_teamCount").prop('readonly', false);
            break;
        default :
            break;
    }
});

$("[id^=rfc_corebundle_][id$=_listCategories]").change(function () {
    $("[id^=rfc_corebundle_][id$=_listVehicles]").val(null);
    if ($("[id^=rfc_corebundle_][id$=_teamCountSelection]").val() !== 'byChoice') {
        $("[id^=rfc_corebundle_][id$=_teamCount]").val(null === $("[id^=rfc_corebundle_][id$=_listCategories]").val() ? 0 : $("[id^=rfc_corebundle_][id$=_listCategories]").val().length);
    }
});

$("[id^=rfc_corebundle_][id$=_listVehicles]").change(function () {
    $("[id^=rfc_corebundle_][id$=_listCategories]").val(null);
    if ($("[id^=rfc_corebundle_][id$=_teamCountSelection]").val() !== 'byChoice') {
        $("[id^=rfc_corebundle_][id$=_teamCount]").val(null === $("[id^=rfc_corebundle_][id$=_listVehicles]").val() ? 0 : $("[id^=rfc_corebundle_][id$=_listVehicles]").val().length);
    }
});

function updateChampionshipCreationValues(teamCount) {
    $("#rfc_corebundle_championship_teamCount").val(teamCount);
    $("#rfc_corebundle_championship_MaximumMainDrivers").val('0');
    $("#rfc_corebundle_championship_MaximumSecondaryDrivers").val('0');
}

$("#rfc_corebundle_championship_teamChampionship").change();