function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function getDateFormatted() {
    var now = new Date();

    var annee   = now.getFullYear();
    var mois    = ('0'+(now.getMonth()+1)).slice(-2);
    var jour    = ('0'+now.getDate()   ).slice(-2);
    var heure   = ('0'+now.getHours()  ).slice(-2);
    var minute  = ('0'+now.getMinutes()).slice(-2);
    var seconde = ('0'+now.getSeconds()).slice(-2);

    return jour+"/"+mois+"/"+annee+" - "+heure+":"+minute+":"+seconde ;
}

var notificationBox = $('#notificationCenter').find('#messages');
var notifications = new Array();
var lastNotificationId = 0;

function animate(element_ID, animation) {  
    $(element_ID).addClass('animated ' + animation);
    $(element_ID).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
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
    animate($('#notificationCenter').find('.bubble').html(notifications.length), 'bounce');
    var icon = "";
    switch(type) {
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
    $(notificationBox).append("<li class=\"container-clearFix ym-clearfix\"><span class=\"left\">" + icon + notification.date + " - " +notification.message + "</span><span class=\"right\"><a href=\"#\" id=\"message"+notification.id+"\" class=\"ym-close\">&nbsp;</a></span></li>");
    $(notificationBox).find('#message'+notification.id).bind("click", function() {
        removeNotification(notification.id);
        return false;
    });
    lastNotificationId++;
}

function drawNotifications() {
    var htmlToDraw = "";
    for(i=0; i<notifications.length; i++) {
        htmlToDraw += "<li class=\"container-clearFix ym-clearfix\"><span class=\"left\">" + icon + notification.date + " - " +notification.message + "</span><span class=\"right\"><a href=\"#\" id=\"message"+notification.id+"\" class=\"ym-close\">&nbsp;</a></span></li>";
    }
    $(notificationBox).html(htmlToDraw);
    animate($('#notificationCenter').find('.bubble').html(notifications.length), 'bounce');
    lastNotificationId = notifications.length;
}

function removeNotification(id) {
    notifications.splice(arrayObjectIndexOf(notifications, id, 'id'), 1);
    $(notificationBox).find("li").find("#message"+id).parent().parent().fadeOut(300, function() { $(this).remove() });
    animate($('#notificationCenter').find('.bubble').html(notifications.length), 'fadeOut');
    if(notifications.length < 1 && $("#notificationCenter").find("#messages").parent().is(":visible")) {
        $("#notificationCenter").find("#messages").parent().slideToggle();
    }
}

$(function() {

    // Functions
    function toggleRules(time) {
        if ($('#rfc_corebundle_championship_isAgreed').is(':checked')) {
            $('#rfc_corebundle_championship_listRules').prop('selectedIndex',
                                                             -1);
            $('#rfc_corebundle_championship_listRules').parent('div')
            .hide(time);
        } else {
            $('#rfc_corebundle_championship_listRules').parent('div')
            .show(time);
        }
    }

    function registerChampionshipBehiavior() {
        var entityData = $(this).attr('id').split(';');
        var data = {
            action : entityData[0].substr(7),
            gameId : entityData[1].substr(5),
            championshipId : entityData[2].substr(13),
            userId : entityData[3].substr(5)
        };
        $.ajax({
            type : "POST",
            url : Routing.generate('ajax_user_register_championship'),
            data : data,
            cache : false
        }).done(function(data) {
            addNotification('Championship application completed', 'success');
            $('#registrationStatus').html(data);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            addNotification('Error while registering to championship', 'error');
        });
        return false;
    }

    function crewApplyRequest(data) {
        var jsonFormatted = JSON.stringify(data);
        $.ajax({
            type : "POST",
            url : Routing.generate('ajax_crew_application'),
            data : jsonFormatted,
            dataType: 'json',
            cache : false
        }).done(function(data) {
            addNotification('Application completed', 'success');
        }).fail(function(jqXHR, textStatus, errorThrown) {
            addNotification('Error while applying crew', 'error');
            $('form#sendCrewApplication button').removeClass('ym-disabled');
            $('form#sendCrewApplication button').prop('disabled', false);
        });
    }

    function crewDeclineRequest(data) {
        var jsonFormatted = JSON.stringify(data);
        $.ajax({
            type : "POST",
            url : Routing.generate('ajax_crew_retire'),
            data : jsonFormatted,
            dataType: 'json',
            cache : false
        }).done(function(data) {
            addNotification('Crew retirement completed', 'success');
        }).fail(function(jqXHR, textStatus, errorThrown) {
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
            type : "POST",
            url : Routing.generate('ajax_crew_accept'),
            data : jsonFormatted,
            dataType: 'json',
            cache : false
        }).done(function(data) {
            addNotification('Crew acceptation completed', 'success');
        }).fail(function(jqXHR, textStatus, errorThrown) {
            addNotification('Error while accepting member to crew', 'error');
            $('form#acceptCrewApplication button').removeClass('ym-disabled');
            $('form#declineCrewApplication button').removeClass('ym-disabled');
            $('form#acceptCrewApplication button').prop('disabled', false);
            $('form#declineCrewApplication button').prop('disabled', false);
        });
    }

    // Screen Admin : System
    // --------------------------------------------
    // ----------------- Properties editing
    // --------------------------------------------
    $('.editable_property').on('save', function(){
        var that = this;
        var oldItemValue = $(that)[0].innerHTML;
        if (!$(that).attr('oldValue')) {
            console.log('Persisting original value: ' + oldItemValue)
            $(that).attr('oldValue', oldItemValue);
        }
    });

    $('#confirm-btn').click(function() {
        var json = [];
        $('#mainProperties').find('tbody tr').each(function() {
            var obj = {},
                $td = $(this).find('td'),
                key = $td.eq(0).text(),
                val = $td.eq(3).text();
            obj[key] = val;
            json.push(obj);
        });
        var jsonFormatted = JSON.stringify(json);
        $('.editable_property').editable('submit', { 
            url: Routing.generate('ajax_properties_update'),
            ajaxOptions: {
                data: jsonFormatted,
                dataType: 'json' //assuming json response
            },
            success: function(data, config) {
                //remove unsaved class
                $(this).removeClass('editable-unsaved').removeAttr('oldValue');
                //show messages
                addNotification('Properties updated', 'success');
                $(this).off('save');
            },
            error: function(errors) {
                var msg = '';
                if(errors && errors.responseText) { //ajax error, errors = xhr object
                    msg = errors.responseText;
                } else { //validation error (client-side or server-side)
                    $.each(errors, function(k, v) { msg += k+": "+v+"<br />"; });
                }
                addNotification('Error while saving properties : ' + msg, 'error');
            }
        });
    });

    $('#reset-btn').click(function() {
        $('.editable_property').each(function() {
            var o = $(this);
            o.editable('setValue', o.attr('oldValue'))	//clear values
            .editable('option', 'pk', o.attr('pk'))	//clear pk
            .removeClass('editable-unsaved')
            .removeAttr('oldValue');
        });
    });

    // Screen Core : Crew
    // --------------------------------------------
    // ----------------- Crew application
    // --------------------------------------------
    $('form#sendCrewRequest').submit(function(e) {
        var data = {
            requesterId : $(this).find('#requesterId').val(),
            mentorId : $(this).find('#mentorId').val(),
            gameId : $(this).find('#gameId').val()
        };
        $('form#sendCrewRequest button').addClass('ym-disabled');
        $('form#sendCrewRequest button').prop('disabled', true);
        crewApplyRequest(data);
        return false;
    });

    $('form#cancelCrewRequest').submit(function() {
        var data = {
            crewId : $(this).find('#crewId').val()
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
    $('form#acceptCrewApplication').submit(function(e) {
        var data = {
            crewId : $(this).find('#crewId').val(),
        };
        $('form#acceptCrewApplication button').addClass('ym-disabled');
        $('form#acceptCrewApplication button').prop('disabled', true);
        $('form#declineCrewApplication button').addClass('ym-disabled');
        $('form#declineCrewApplication button').prop('disabled', true);
        crewAcceptRequest(data);
        return false;
    });

    $('form#declineCrewApplication').submit(function(e) {
        var data = {
            crewId : $(this).find('#crewId').val()
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
    $(".eventItem").click(function() {
        $('.eventItem').removeClass('active');
        $(this).addClass("active")
        var entityData = $(this).attr('id').split(';');
        var data = {
            eventId : entityData[0].substr(6),
            gameId : entityData[1].substr(5),
            championshipId : entityData[2].substr(13)
        };
        $.ajax({
            type : "POST",
            url : Routing.generate('admin_session_search'),
            data : data,
            cache : false,
            beforeSend : function() {
                $('#listSessions').html("Chargement des sessions...");
            }
        }).done(function(data) {
            $('#listSessions').html(data);
        }).fail(function() {
            $('#listSessions').html("Impossible de rÃ©cupÃ©rer un rÃ©sultat");
        });
        return false;
    });

    // --------------------------------------------
    // ----------------- Register/unregister
    // --------------------------------------------
    $("#registrationStatus").on('click', '.actionRegisterUnregister',
                                registerChampionshipBehiavior);

    // Screen MetaRule
    // --------------------------------------------
    // ----------------- Show rules / metaRules
    // --------------------------------------------
    $("div.metaRuleItem").click(function() {
        $('.metaRuleItem').removeClass('active');
        $(this).addClass("active")
        var entityData = $(this).attr('id').split(';');
        var data = {
            metaRuleId : entityData[0].substr(9),
            gameId : entityData[1].substr(5)
        };
        $.ajax({
            type : "POST",
            url : Routing.generate('admin_rule_search'),
            data : data,
            cache : false,
            beforeSend : function() {
                $('#listRules').html("Chargement des rÃ¨gles...");
            }
        }).done(function(data) {
            $('#listRules').html(data);
        }).fail(function() {
            $('#listRules').html("Impossible de rÃ©cupÃ©rer un rÃ©sultat");
        });
        return false;
    });

    $("div.metaRuleItem").hover(function() {
        $(this).children(".editZone").show();
    }, function() {
        $(this).children(".editZone").hide();
    })

    // --------------------------------------------
    // ----------------- Image collection behiavior
    // --------------------------------------------

    // Comportement pour les images dans les formulaires
    // RÃ©cupÃ¨re le div qui contient la collection de tags
    var collectionHolder = $('ul.images');

    // ajoute un lien Â« add a tag Â»
    var $addImageLink = $('<a href="#" class="add_image_link">Ajouter une image</a>');
    var $newLinkLi = $('<li></li>').append($addImageLink);

    jQuery(document)
    .ready(
        function() {
            // ajoute un lien de suppression Ã  tous les Ã©lÃ©ments li
            // de
            // formulaires de tag existants
            collectionHolder.find('li').each(function() {
                addImageFormDeleteLink($(this));
            });

            // ajoute l'ancre Â« ajouter un tag Â» et li Ã  la balise
            // ul
            collectionHolder.append($newLinkLi);

            $addImageLink.on('click', function(e) {
                // empÃªche le lien de crÃ©er un Â« # Â» dans l'URL
                e.preventDefault();

                // ajoute un nouveau formulaire tag (voir le
                // prochain bloc de code)
                addImageForm(collectionHolder, $newLinkLi);
            });

            function addImageForm(collectionHolder, $newLinkLi) {
                // RÃ©cupÃ¨re l'Ã©lÃ©ment ayant l'attribut
                // data-prototype comme expliquÃ©
                // plus tÃ´t
                var prototype = collectionHolder
                .attr('data-prototype');

                // Remplace '__name__' dans le HTML du prototype par
                // un nombre basÃ© sur
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

            function addImageFormDeleteLink($imageFormLi) {
                var $removeFormA = $('<a href="#">Supprimer cette image</a>');
                $imageFormLi.append($removeFormA);

                $removeFormA.on('click', function(e) {
                    // empÃªche le lien de crÃ©er un Â« # Â» dans l'URL
                    e.preventDefault();

                    // supprime l'Ã©lÃ©ment li pour le formulaire de
                    // tag
                    $imageFormLi.remove();
                });
            }
        });

    // Init phase
    $("#msg").hide();
    $("#msg").click(function() {
        $(this).hide();   
    });

    // --------------------------------------------
    // ----------------- Notification center
    // --------------------------------------------
    $("#notificationCenter").find(".bubble").click(function() {
        if(notifications.length > 0) {
            $("#notificationCenter").find("#messages").parent().slideToggle();
        }
        return false;
    });
    drawNotifications();

    $("#gameSlideshow").camera({
        loader: 'bar',
        fx: 'scrollLeft',
        transPeriod: 750,
        height: '350px',
        playPause: true
    });
    $("textarea").wysibb();
    toggleRules(0);
    $(".eventItem:first").trigger("click");
    $(".metaRuleItem:first").trigger("click");
    // X-editable default values
    $.fn.editable.defaults.mode = 'inline';
    // X-editable activation on each elements
    $("table#mainProperties span.editable_property").editable();

    // Behiavior
    $('#rfc_corebundle_championship_isAgreed').change(function() {
        toggleRules(200);
    });
    // Table clickable
    $('tr').has('td').has('a').hover(function() {
        $(this).css('cursor', 'pointer');
    });
    $('tr').has('td').has('a').click(function() {
        var href = $(this).find('a').attr('href');
        if(href) {
            window.location = href;
        }
    });

    // CSS Init
    $("#breadcrumbs").rcrumbs();
    $("div.metaRuleItem").find(".editZone").hide();
    $("#notificationCenter").find("#messages").parent().hide();
    $(".jquery_tabs").accessibleTabs();
})