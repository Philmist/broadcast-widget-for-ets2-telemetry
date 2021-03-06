﻿Funbit.Ets.Telemetry.Dashboard.prototype.initialize = function (skinConfig, utils) {

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

let estDanger = false;
let bedDanger = 0;

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data, utils) {
    let steerPositionPercentage = (data.truck.gameSteer + 1.0) * 50.0;
    let steerUserPositionPercentage = (data.truck.userSteer + 1.0) * 50.0;
    let gameThrottlePercentage = data.truck.gameThrottle * 100.0;
    let gameBrakePercentage = data.truck.gameBrake * 100.0;
    let gameThrottleInversePercentage = 100.0 - gameThrottlePercentage;
    let gameBrakeInversePercentage = 100.0 - gameBrakePercentage;

    let estTimeDate = new Date(data.navigation.estimatedTime);
    let remainingTimeDate = new Date(data.job.remainingTime);
    let nextRestStopTimeDate = new Date(data.game.nextRestStopTime);

    let bedMark = document.getElementById("bed-mark");
    let estClockMark = document.getElementById("est-clock-mark");

    if ((data.job.destinationCity && data.job.destinationCity !== "") && (remainingTimeDate.getTime() < estTimeDate.getTime())) {
        if (!estDanger) {
            estClockMark.classList.add("danger");
            estDanger = true;
        }
    } else {
        if (estDanger) {
            estClockMark.classList.remove("danger");
            estDanger = false;
        }
    }

    if (nextRestStopTimeDate.getUTCHours() == 0) {
        if (bedDanger !== 2) {
            if (bedDanger == 1) {
                bedMark.classList.remove("caution");
            }
            bedMark.classList.add("danger");
            bedDanger = 2;
        }
    } else if (estTimeDate.getTime() > nextRestStopTimeDate.getTime()) {
        if (bedDanger == 0) {
            bedDanger = 1;
            bedMark.classList.add("caution");
        }
    } else {
        if (bedDanger == 2) {
            bedMark.classList.remove("danger");
        } else if (bedDanger == 1) {
            bedMark.classList.remove("caution");
        }
        bedDanger = 0;
    }

    document.getElementById("game-steer-position").style.right = `${steerPositionPercentage}%`;
    document.getElementById("user-steer-position").style.right = `${steerUserPositionPercentage}%`;
    document.getElementById("throttle").style.width = `${gameThrottlePercentage}%`;
    document.getElementById("brake").style.width = `${gameBrakePercentage}%`;
}