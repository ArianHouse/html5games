/*global Config, States, Events*/

/* This object contains the function which defines all transitions in the state machine */

var Rules = function (actions) {
    "use strict";
    this.actions = actions;
};
Rules.prototype = {
    initStateMachine: function (stateMachine) {
        "use strict";
        stateMachine.addTransition(States.FIRST, Events.INIT, States.LOGIN, [this.actions.registerInputCapture.bind(this.actions), this.actions.showLoginPage.bind(this.actions)]);

        stateMachine.addTransition(States.LOGIN, Events.LOGIN_BUTTON_CLICK, States.LOGIN, [this.actions.validateLogin.bind(this.actions)]);
        stateMachine.addTransition(States.LOGIN, Events.ENTER_PRESSED, States.LOGIN, [this.actions.validateLogin.bind(this.actions)]);
        stateMachine.addTransition(States.LOGIN, Events.ERROR_CONNECTION, States.LOGIN, [this.actions.showLoginErrorConnection.bind(this.actions)]);
        stateMachine.addTransition(States.LOGIN, Events.LOGIN_REFUSED, States.LOGIN, [this.actions.showLoginInvalid.bind(this.actions)]);
        stateMachine.addTransition(States.LOGIN, Events.LOGIN_CONFIRMED, States.LOGIN, [this.actions.requestServerAddress.bind(this.actions)]);
        stateMachine.addTransition(States.LOGIN, Events.IP_RECEIVED, States.LOGIN, [this.actions.connectToSever.bind(this.actions)]);
        stateMachine.addTransition(States.LOGIN, Events.CONNECTION_ESTABLISHED, States.ROOMS, [this.actions.sendLoginToServer.bind(this.actions)]);

        stateMachine.addTransition(States.ROOMS, Events.SERVER_ACK_LOGIN, States.ROOMS, [this.actions.requestRoomsInfo.bind(this.actions)]);
        stateMachine.addTransition(States.ROOMS, Events.ROOMS_INFO_RECEIVED, States.ROOMS, [this.actions.populateRoomsPage.bind(this.actions), this.actions.showRoomsPage.bind(this.actions)]);
        stateMachine.addTransition(States.ROOMS, Events.ROOM_CLICKED, States.ROOMS, [this.actions.requestEnterRoom.bind(this.actions)]);
        stateMachine.addTransition(States.ROOMS, Events.SERVER_ALLOW_ENTER_ROOM, States.WAIT_PLAYERS, [this.actions.showWaitPlayersPage.bind(this.actions)]);
        stateMachine.addTransition(States.ROOMS, Events.LOGOUT_CLICKED, States.LOGIN, [this.actions.disconnect.bind(this.actions), this.actions.showLoginPage.bind(this.actions)]);
        stateMachine.addTransition(States.ROOMS, Events.ERROR_CONNECTION, States.ROOMS, [this.actions.showReconnectPage.bind(this.actions)]);
        stateMachine.addTransition(States.ROOMS, Events.RECONNECTION, States.ROOMS, [this.actions.hideReconnectPage.bind(this.actions)]);
        stateMachine.addTransition(States.ROOMS, Events.CONNECTION_ESTABLISHED, States.ROOMS, [this.actions.sendLoginToServer.bind(this.actions)]);

        stateMachine.addTransition(States.WAIT_PLAYERS, Events.BACK_CLICKED, States.WAIT_PLAYERS, [this.actions.requestExitRoom.bind(this.actions)]);
        stateMachine.addTransition(States.WAIT_PLAYERS, Events.SERVER_ACK_EXIT_ROOM, States.ROOMS, [this.actions.showRoomsPage.bind(this.actions)]);
        stateMachine.addTransition(States.WAIT_PLAYERS, Events.ROOMS_INFO_RECEIVED, States.WAIT_PLAYERS, [this.actions.showPlayers.bind(this.actions)]);
        stateMachine.addTransition(States.WAIT_PLAYERS, Events.ERROR_CONNECTION, States.WAIT_PLAYERS, [this.actions.showReconnectPage.bind(this.actions)]);
        stateMachine.addTransition(States.WAIT_PLAYERS, Events.RECONNECTION, States.WAIT_PLAYERS, [this.actions.hideReconnectPage.bind(this.actions)]);
        stateMachine.addTransition(States.WAIT_PLAYERS, Events.CONNECTION_ESTABLISHED, States.WAIT_PLAYERS, [this.actions.sendLoginToServer.bind(this.actions)]);
        stateMachine.addTransition(States.WAIT_PLAYERS, Events.SERVER_ACK_LOGIN, States.WAIT_PLAYERS, [this.actions.requestRoomsInfo.bind(this.actions)]);
        stateMachine.addTransition(States.WAIT_PLAYERS, Events.READY_FOR_GAME, States.WAIT_PLAYERS, [this.actions.requestTeams.bind(this.actions)]);
        stateMachine.addTransition(States.WAIT_PLAYERS, Events.TEAMS_RECEIVED, States.READY, [this.actions.showTeams.bind(this.actions), this.actions.showReadyPage.bind(this.actions), this.actions.startCountdown.bind(this.actions)]);

        stateMachine.addTransition(States.READY, Events.UNREADY_FOR_GAME, States.WAIT_PLAYERS, [this.actions.stopCountdown.bind(this.actions), this.actions.requestRoomsInfo.bind(this.actions), this.actions.showWaitPlayersPage.bind(this.actions)]);
        stateMachine.addTransition(States.READY, Events.ERROR_CONNECTION, States.READY, [this.actions.stopCountdown.bind(this.actions), this.actions.showReconnectPage.bind(this.actions)]);
        stateMachine.addTransition(States.READY, Events.RECONNECTION, States.READY, [this.actions.hideReconnectPage.bind(this.actions)]);
        stateMachine.addTransition(States.READY, Events.CONNECTION_ESTABLISHED, States.READY, [this.actions.sendLoginToServer.bind(this.actions)]);
        stateMachine.addTransition(States.READY, Events.SERVER_ACK_LOGIN, States.READY, [this.actions.startCountdown.bind(this.actions), this.actions.requestRoomsInfo.bind(this.actions)]);
        stateMachine.addTransition(States.READY, Events.BACK_CLICKED, States.READY, [this.actions.requestExitRoom.bind(this.actions)]);
        stateMachine.addTransition(States.READY, Events.SERVER_ACK_EXIT_ROOM, States.ROOMS, [this.actions.stopCountdown.bind(this.actions), this.actions.showRoomsPage.bind(this.actions)]);
        stateMachine.addTransition(States.READY, Events.INTERVAL_TIMEOUT, States.READY, [this.actions.requestPieces.bind(this.actions)]);
        stateMachine.addTransition(States.READY, Events.PIECES_RECEIVED, States.GAME, [this.actions.initGame.bind(this.actions), this.actions.showGamePage.bind(this.actions)]);
    }
};