export const getConnectedAddress = (accounts: any) => {
    if (accounts.length) {
        return accounts[0];
    } else {
        throw new Error("Please log in to Metamask");
    }
}