export enum CellMoveability {
    None = 0,
    
    CanStop = 1 << 0,
    CanPass = 1 << 1,

    All = CanStop | CanPass,
}