export type Projection<T> = {
  [K in keyof T]?: 0 | 1
}
