import { Router } from "@oak/oak";
import { db } from "../main.ts";

import { APIErreurCode, APIException, APIResponse } from "../model/reponse.ts";

const router = new Router({ prefix: "/profil" });