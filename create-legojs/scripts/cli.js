#!/usr/bin/env node
import { prepare } from "./prepare.js";
import { create } from "./create.js";


create(await prepare());
