Funbit.Ets.Telemetry.Dashboard.prototype.initialize = function (skinConfig, utils) {

}

Funbit.Ets.Telemetry.Dashboard.prototype.filter = function (data, utils) {

    // round truck speed
    data.truck.speedRounded = Math.abs(data.truck.speed > 0
        ? Math.floor(data.truck.speed)
        : Math.round(data.truck.speed));
    
    // round fuel
    data.truck.fuel = utils.formatFloat(data.truck.fuel, 2);
    data.truck.fuelAverageConsumption = utils.formatFloat(data.truck.fuelAverageConsumption, 2);
    
    // rest time
    let nextRestStopTimeDate = new Date(data.game.nextRestStopTime);
    let restHours = nextRestStopTimeDate.getUTCHours();
    let restMinutes = nextRestStopTimeDate.getUTCMinutes();
    data.game.nextRestStopTimeString = `${restHours}h${restMinutes}m`;

    // EST
    let estTimeDate = new Date(data.navigation.estimatedTime);
    let estHours = estTimeDate.getUTCHours();
    let estMinutes = estTimeDate.getUTCMinutes();
    data.navigation.estimatedTimeString = `${estHours}h${estMinutes}m`;

    return data;
};

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data, utils) {
    let steerPositionPercentage = (data.truck.gameSteer + 1.0) * 50.0;
    let steerUserPositionPercentage = (data.truck.userSteer + 1.0) * 50.0;
    let gameThrottleInversePercentage = 100.0 - data.truck.gameThrottle * 100.0;
    let gameBrakeInversePercentage = 100.0 - data.truck.gameBrake * 100.0;

    let estTimeDate = new Date(data.navigation.estimatedTime);
    let remainingTimeDate = new Date(data.job.remainingTime);
    let nextRestStopTimeDate = new Date(data.game.nextRestStopTime);

    let bedMark = document.getElementById("bed-mark");
    let estClockMark = document.getElementById("est-clock-mark");

    if ((data.job.destinationCity && data.job.destinationCity !== "") && (remainingTimeDate.getTime() < estTimeDate.getTime())) {
        if (!estClockMark.classList.contains("danger")) {
            estClockMark.classList.add("danger");
        }
    } else {
        estClockMark.classList.remove("danger");
    }

    if (nextRestStopTimeDate.getUTCHours() == 0) {
        bedMark.classList.remove("caution");
        if (!bedMark.classList.contains("danger")) {
            bedMark.classList.add("danger");
        }
    } else if (estTimeDate.getTime() > nextRestStopTimeDate.getTime()) {
        if ((!bedMark.classList.contains("caution")) && (!bedMark.classList.contains("danger"))) {
            bedMark.classList.add("caution");
        }
    } else {
        bedMark.classList.remove("caution");
        bedMark.classList.remove("danger");
    }

    document.getElementById("game-steer-position").style.right = `${steerPositionPercentage}%`;
    document.getElementById("user-steer-position").style.right = `${steerUserPositionPercentage}%`;
    document.getElementById("inverse-throttle").style.width = `${gameThrottleInversePercentage}%`;
    document.getElementById("inverse-brake").style.width = `${gameBrakeInversePercentage}%`;
}