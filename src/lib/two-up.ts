// Two pages on one A4 sheet (A5), for the PDF and the print view.
/**
 * Pairs pages for printing two on one A4 sheet: consecutive pages of the same
 * orientation share a sheet (two landscape pages as A5 one above the other on
 * an upright sheet, two upright pages side by side on a landscape sheet).
 */
export function twoUpSheets<T extends { orientation: 'portrait' | 'landscape' }>(pages: T[]): T[][] {
  const sheets: T[][] = [];
  for (const page of pages) {
    const last = sheets[sheets.length - 1];
    if (last && last.length === 1 && last[0].orientation === page.orientation) last.push(page);
    else sheets.push([page]);
  }
  return sheets;
}
