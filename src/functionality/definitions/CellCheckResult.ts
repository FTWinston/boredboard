export enum CellMoveability {
    None = 0,
    
    CanEnter = 1 << 0,
    CanStop = 1 << 1,
    CanPass = 1 << 2,

    StopBeforeThisCell = None,
    StopAtThisCell = CanEnter & CanStop,
    ContinueWithoutStopping = CanEnter & CanPass,
    StopOrContinue = CanEnter & CanPass & CanStop,
}