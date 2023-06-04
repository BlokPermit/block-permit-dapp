export const formatDate = (dateISO: string | Date) => {
    let date = new Date(dateISO);
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return date.toLocaleDateString('sl-SI', options as any);
}