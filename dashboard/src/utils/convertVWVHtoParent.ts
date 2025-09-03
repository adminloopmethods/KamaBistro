export const convertVWVHtoPxParentClamped = (
  style: React.CSSProperties,
  parent: HTMLElement | null
): React.CSSProperties => {
  if (!parent) return style;

  const parentWidth = parent.offsetWidth;
  const parentHeight = parent.offsetHeight;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const newStyle: React.CSSProperties = {};

  Object.entries(style).forEach(([key, value]) => {
    const cssKey = key as keyof React.CSSProperties;

    if (typeof value === "string") {
      if (value.endsWith("vw")) {
        const vw = parseFloat(value);
        let pxValue = (vw / 100) * parentWidth;
        // Clamp to screen width max
        pxValue = Math.min(pxValue, screenWidth);
        newStyle[cssKey] = `${pxValue}px` as any;
      } else if (value.endsWith("vh")) {
        const vh = parseFloat(value);
        let pxValue = (vh / 100) * parentHeight;
        // Clamp to screen height max
        pxValue = Math.min(pxValue, screenHeight);
        newStyle[cssKey] = `${pxValue}px` as any;
      } else {
        newStyle[cssKey] = value as any;
      }
    } else {
      newStyle[cssKey] = value as any;
    }
  });

  return newStyle;
};
