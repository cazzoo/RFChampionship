$(function() {

	// Behiavior
	$('#rfc_corebundle_championship_isAgreed').change(function() {
		toggleRules(200);
	});

	// Functions
	function toggleRules(time) {
		if ($('#rfc_corebundle_championship_isAgreed').is(':checked')) {
			$('#rfc_corebundle_championship_listRules').prop('selectedIndex',
					-1)
			$('#rfc_corebundle_championship_listRules').parent('div')
					.hide(time);
		} else {
			$('#rfc_corebundle_championship_listRules').parent('div')
					.show(time);
		}
	}
	;

	// Screen Championship
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
			$('#listSessions').replaceWith(data);
		}).fail(function() {
			$('#listSessions').html("Impossible de récupérer un résultat");
		});
		return false;
	});

	// Screen MetaRule
	$(".metaRuleItem").click(function() {
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

	$(".metaRuleItem").hover(function() {
		$(this).children(".editZone").show();
	}, function() {
		$(this).children(".editZone").hide();
	})

	// Comportement pour les images dans les formulaires
	// Récupère le div qui contient la collection de tags
	var collectionHolder = $('ul.images');

	// ajoute un lien « add a tag »
	var $addImageLink = $('<a href="#" class="add_image_link">Ajouter une image</a>');
	var $newLinkLi = $('<li></li>').append($addImageLink);

	jQuery(document).ready(function() {
		// ajoute un lien de suppression à tous les éléments li de
		// formulaires de tag existants
		collectionHolder.find('li').each(function() {
			addImageFormDeleteLink($(this));
		});

		// ajoute l'ancre « ajouter un tag » et li à la balise ul
		collectionHolder.append($newLinkLi);

		$addImageLink.on('click', function(e) {
			// empêche le lien de créer un « # » dans l'URL
			e.preventDefault();

			// ajoute un nouveau formulaire tag (voir le prochain bloc de code)
			addImageForm(collectionHolder, $newLinkLi);
		});
	});

	function addImageForm(collectionHolder, $newLinkLi) {
		// Récupère l'élément ayant l'attribut data-prototype comme expliqué
		// plus tôt
		var prototype = collectionHolder.attr('data-prototype');

		// Remplace '__name__' dans le HTML du prototype par un nombre basé sur
		// la longueur de la collection courante
		var newForm = prototype.replace(/__name__/g, collectionHolder
				.children().length);

		// Affiche le formulaire dans la page dans un li, avant le lien "ajouter
		// une image"
		var $newFormLi = $('<li></li>').append(newForm);
		$newLinkLi.before($newFormLi);

		// ajoute un lien de suppression au nouveau formulaire
		addImageFormDeleteLink($newFormLi);
	}

	function addImageFormDeleteLink($imageFormLi) {
		var $removeFormA = $('<a href="#">Supprimer cette image</a>');
		$imageFormLi.append($removeFormA);

		$removeFormA.on('click', function(e) {
			// empêche le lien de créer un « # » dans l'URL
			e.preventDefault();

			// supprime l'élément li pour le formulaire de tag
			$imageFormLi.remove();
		});
	}

	// Init phase
	toggleRules(0);
	$(".eventItem:first").trigger("click");
	// $(".metaRuleItem:first").trigger("click");

	// CSS Init
	$(".metaRuleItem .editZone").hide();
});