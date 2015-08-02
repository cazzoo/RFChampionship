$.fn.api.settings.api = {
    'user register team' : '/team/{teamid}/register/{drivertype}/{driverid}',
    'user unregister team' : '/team/{teamid}/unregister/{drivertype}/{driverid}',
};
$.fn.api.settings.successTest = function(response) {
    if(response && response.success) {
        return response.success;
    }
    return false;
};