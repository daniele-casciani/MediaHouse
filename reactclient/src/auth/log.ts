// src/auth/log.ts
import { Log } from 'oidc-client-ts';

Log.setLogger(console);

// Set log level: NONE, ERROR, WARN, INFO
Log.setLevel(Log.INFO);
