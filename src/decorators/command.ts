export interface CommandDecoratorOptions {
  args?: string;
  command: string;
  description: string;
  global?: boolean;
  group: string;
  options?: any;
}

export function TakeoffCommandDecorator(options: CommandDecoratorOptions) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    Object.keys(options).forEach((key: keyof CommandDecoratorOptions) => {
      constructor.prototype[key] = options[key];
    });

    return class extends constructor {};
  };
}

// export function TakeoffCommand<T extends { new (...args: any[]): {} }>(constructor: T) {
//   return class extends constructor {};
// }
