declare const window: any;

export function getBrowserAddress(): string {
    return "BID" + window.visitorId;
}