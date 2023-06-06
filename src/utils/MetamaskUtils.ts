// This function can only be called from frontend
export const getConnectedAddress = async (window: Window) => {
    const accounts = await window.ethereum.request({method: 'eth_accounts'});
    if (accounts.length) {
        return accounts[0];
    } else {
        if (!window.ethereum.isConnected()) {
            throw new Error("Prosimo povežite to stran z Metamaskom");
        }
        throw new Error("Prosimo prijavite se v Metamask");
    }
}