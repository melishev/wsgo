export type RemoveFirstFromTuple<T extends any[]> =
  T['length'] extends 0 ? undefined :
      (((...b: T) => void) extends (a: any, ...b: infer I) => void ? I : [])
