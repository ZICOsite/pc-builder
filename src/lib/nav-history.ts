let visitCount = 0;

export function recordVisit() {
  visitCount += 1;
}

export function hasNavigatedInApp() {
  return visitCount > 1;
}
