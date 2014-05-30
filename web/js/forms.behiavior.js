$(document).ready(
		function() {

			// Init phase
			hideRules();

			// Behiavior
			$('#rfc_corebundle_championship_isAgreed').change(function() {
				hideRules();
			});

			// Functions
			function hideRules() {
				if ($('#rfc_corebundle_championship_isAgreed').is(':checked')) {
					$('#rfc_corebundle_championship_listRules').prop(
							'selectedIndex', -1)
					$('#rfc_corebundle_championship_listRules').parent('div')
							.hide('200');
				} else {
					$('#rfc_corebundle_championship_listRules').parent('div')
							.show('200');
				}
			}
		});