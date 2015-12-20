$.fn.api.settings.api = {
    'user register team' : '/team/{teamid}/register/{drivertype}/{driverid}',
    'user unregister team' : '/team/{teamid}/unregister/{drivertype}/{driverid}',
    'user championship registration' : '/championship/{championshipid}/{driverid}/{registeraction}/{drivertype}/{/teamid}',
    'user vehicle selection' : '/registration/{registrationid}/{vehicleid}/{registeraction}',
};
$.fn.api.settings.successTest = function(response) {
    if(response && response.success) {
        return response.success;
    }
    return false;
};