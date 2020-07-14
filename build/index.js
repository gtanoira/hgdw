"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const index_1 = require("./server/index");
const index_2 = require("./database/index");
const environment_settings_1 = require("./settings/environment.settings");
index_2.HotGoDBase.setConnections();
const server = new index_1.ApiServer();
server.start(environment_settings_1.SERVER_PORT);
