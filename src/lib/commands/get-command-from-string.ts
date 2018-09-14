import { TakeoffCommandRequest } from "takeoff";

const DEFAULT_COMMAND = 'takeoff';

export = (command: string): TakeoffCommandRequest => {
  const commandParts = (command && command.split(':')) || [DEFAULT_COMMAND];
  return commandParts.length > 1
    ? {
        app: commandParts[1],
        cmd: commandParts[0],
      }
    : { app: commandParts[0], cmd: DEFAULT_COMMAND };
};
