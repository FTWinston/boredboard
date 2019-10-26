export enum Relationship {
    None = 0,
    Self = 1 << 0,
    Enemy = 1 << 1,
    Ally = 1 << 2,
}