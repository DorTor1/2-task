declare module '@task-platform/shared' {
  export * from '../packages/shared/dist/index';
}

declare module '@task-platform/shared/*' {
  export * from '../packages/shared/dist';
}
