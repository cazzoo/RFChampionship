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

	$(".eventItem").click(function() {
		$('.eventItem').removeClass('active');
		$(this).addClass("active")
		var data = {
			eventId : $(this).attr('id').substr(6)
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

	// Init phase
	toggleRules(0);
	$(".eventItem:first").trigger("click");
});