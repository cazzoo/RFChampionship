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
			$('#listSessions').html(data);
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

	// Init phase
	toggleRules(0);
	$(".eventItem:first").trigger("click");
	$(".metaRuleItem:first").trigger("click");
});