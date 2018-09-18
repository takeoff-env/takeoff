export interface CommandDecoratorOptions {
  command: string;
  group: string;
  description: string;
  args?: string;
  options?: any;
}

// export function TakeoffCommand(options: CommandDecoratorOptions) {
//   console.log(options);
//   return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//     console.log(target, propertyKey, descriptor);
//   };
// }

export function TakeoffCommand<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {};
}
