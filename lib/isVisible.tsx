export const isVisible = (el: HTMLElement): boolean => {
    const rect = el.getBoundingClientRect();
    const vWidth = window.innerWidth || document.documentElement.clientWidth;
    const vHeight = (window.innerHeight || document.documentElement.clientHeight) - 50;
    return !(rect.right < 0 || rect.bottom < 50 ||
        rect.left > vWidth || rect.top > vHeight);
};
