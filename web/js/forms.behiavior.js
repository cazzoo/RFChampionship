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
			$('#registrationStatus').html(data);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			alert(jqXHR.status, errorThrown);
			$('#registrationStatus').html("Impossible d'éffectuer l'action");
		});
		return false;
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
               var msg = 'Properties updated!';
               $('#msg').addClass('messagebox-success').removeClass('messagebox-error').html(msg).show();;
               $(this).off('save');
           },
           error: function(errors) {
               var msg = '';
               if(errors && errors.responseText) { //ajax error, errors = xhr object
                   msg = errors.responseText;
               } else { //validation error (client-side or server-side)
                   $.each(errors, function(k, v) { msg += k+": "+v+"<br />"; });
               } 
               $('#msg').removeClass('messagebox-success').addClass('messagebox-error').html(msg).show();;
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
			$('#listSessions').html("Impossible de récupérer un résultat");
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
				$('#listRules').html("Chargement des règles...");
			}
		}).done(function(data) {
			$('#listRules').html(data);
		}).fail(function() {
			$('#listRules').html("Impossible de récupérer un résultat");
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
	// Récupère le div qui contient la collection de tags
	var collectionHolder = $('ul.images');

	// ajoute un lien « add a tag »
	var $addImageLink = $('<a href="#" class="add_image_link">Ajouter une image</a>');
	var $newLinkLi = $('<li></li>').append($addImageLink);

	jQuery(document)
			.ready(
					function() {
						// ajoute un lien de suppression à tous les éléments li
						// de
						// formulaires de tag existants
						collectionHolder.find('li').each(function() {
							addImageFormDeleteLink($(this));
						});

						// ajoute l'ancre « ajouter un tag » et li à la balise
						// ul
						collectionHolder.append($newLinkLi);

						$addImageLink.on('click', function(e) {
							// empêche le lien de créer un « # » dans l'URL
							e.preventDefault();

							// ajoute un nouveau formulaire tag (voir le
							// prochain bloc de code)
							addImageForm(collectionHolder, $newLinkLi);
						});

						function addImageForm(collectionHolder, $newLinkLi) {
							// Récupère l'élément ayant l'attribut
							// data-prototype comme expliqué
							// plus tôt
							var prototype = collectionHolder
									.attr('data-prototype');

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

						function addImageFormDeleteLink($imageFormLi) {
							var $removeFormA = $('<a href="#">Supprimer cette image</a>');
							$imageFormLi.append($removeFormA);

							$removeFormA.on('click', function(e) {
								// empêche le lien de créer un « # » dans l'URL
								e.preventDefault();

								// supprime l'élément li pour le formulaire de
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
    $("#gameSlideshow").camera({
        loader: 'bar',
        fx: 'scrollLeft',
        transPeriod: 750,
        height: '350px',
        playPause: true
    });
	toggleRules(0);
	$(".eventItem:first").trigger("click");
	// $(".metaRuleItem:first").trigger("click");
    // X-editable default values
    $.fn.editable.defaults.mode = 'inline';
    // X-editable activation on each elements
    $("table#mainProperties span.editable_property").editable();
    
	// Behiavior
	$('#rfc_corebundle_championship_isAgreed').change(function() {
		toggleRules(200);
	});
    
	// CSS Init
    $("#breadcrumbs li:not(:last)").append("<span class='divider'>></span>")
    $("#breadcrumbs").rcrumbs();
	$("div.metaRuleItem .editZone").hide();
    $(".jquery_tabs").accessibleTabs();
})