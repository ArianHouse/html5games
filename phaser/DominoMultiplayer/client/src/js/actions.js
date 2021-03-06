/*global Config, Codes*/

/* This object contains all functions called in transitions in the state machine */

var Actions = function (dominoSystem) {
    "use strict";
    this.dominoSystem = dominoSystem;
};
Actions.prototype = {
    showLoginPage: function () {
        "use strict";
        this.dominoSystem.pages.rooms.hide();
        this.dominoSystem.pages.login.show();
    },
    showRoomsPage: function () {
        "use strict";
        this.dominoSystem.pages.ready.hide();
        this.dominoSystem.pages.waitPlayers.hide();
        this.dominoSystem.pages.login.hide();
        this.dominoSystem.pages.rooms.show();
    },
    showWaitPlayersPage: function () {
        "use strict";
        this.dominoSystem.pages.ready.hide();
        this.dominoSystem.pages.rooms.hide();
        this.dominoSystem.pages.waitPlayers.show();
    },
    registerInputCapture: function () {
        "use strict";
        this.dominoSystem.hardware.registerCallbacks();
    },
    validateLogin: function () {
        "use strict";
        var login = this.dominoSystem.pages.login.getLoginInput(),
            password = this.dominoSystem.pages.login.getPasswordInput();
        this.dominoSystem.client.requestLoginValidation(login, password);
    },
    showLoginInvalid: function () {
        "use strict";
        this.dominoSystem.pages.login.showLoginInvalid();
    },
    showLoginErrorConnection: function () {
        "use strict";
        this.dominoSystem.pages.login.showErrorConnection();
    },
    requestServerAddress: function () {
        "use strict";
        this.dominoSystem.client.requestServerAddress();
    },
    connectToSever: function () {
        "use strict";
        this.dominoSystem.client.connect();
    },
    sendLoginToServer: function () {
        "use strict";
        this.dominoSystem.client.sender.sendLogin();
    },
    requestRoomsInfo: function () {
        "use strict";
        this.dominoSystem.client.sender.requestRoomsInfo();
    },
    requestEnterRoom: function () {
        "use strict";
        var roomNumber = this.dominoSystem.hardware.inputValues.roomNumber;
        this.dominoSystem.client.sender.requestEnterRoom(roomNumber);
    },
    populateRoomsPage: function () {
        "use strict";
        var roomList = this.dominoSystem.client.receiver.receivedValues.roomList;
        this.dominoSystem.pages.rooms.populateRooms(roomList);
    },
    requestExitRoom: function () {
        "use strict";
        this.dominoSystem.client.sender.requestExitRoom();
    },
    showPlayers: function () {
        "use strict";
        var roomList = this.dominoSystem.client.receiver.receivedValues.roomList;
        this.dominoSystem.pages.waitPlayers.showPlayers(roomList, this.dominoSystem.user);
    },
    disconnect: function () {
        "use strict";
        this.dominoSystem.client.sender.requestDisconnection();
    },
    showReconnectPage: function () {
        "use strict";
        this.dominoSystem.pages.reconnect.show();
    },
    hideReconnectPage: function () {
        "use strict";
        this.dominoSystem.pages.reconnect.hide();
    },
    showReadyPage: function () {
        "use strict";
        this.dominoSystem.pages.waitPlayers.hide();
        this.dominoSystem.pages.ready.show();
    },
    showTeams: function () {
        "use strict";
        var userList = this.dominoSystem.client.receiver.receivedValues.userList;
        this.dominoSystem.pages.ready.showTeams(userList, this.dominoSystem.user);
    },
    startCountdown: function () {
        "use strict";
        this.dominoSystem.pages.ready.startCountdown();
    },
    stopCountdown: function () {
        "use strict";
        this.dominoSystem.pages.ready.stopCountdown();
    },
    requestTeams: function () {
        "use strict";
        this.dominoSystem.client.sender.requestTeams();
    },
    requestPieces: function () {
        "use strict";
        this.dominoSystem.client.sender.requestPieces();
    },
    showGamePage: function () {
        "use strict";
        this.dominoSystem.pages.ready.hide();
        this.dominoSystem.pages.game.show();
    },
    initGame: function () {
        "use strict";
        this.dominoSystem.initGame(this.dominoSystem.client.receiver.receivedValues.pieces);
    }
};