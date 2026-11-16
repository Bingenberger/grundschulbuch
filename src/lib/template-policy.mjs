/** School defaults, with independent overrides for each class. */
export function templatePolicy(policies, hidden, key, classId) {
  const global = policies?.global?.[key] || {};
  const local = classId ? policies?.classes?.[classId]?.[key] || {} : {};
  return {
    enabled: local.enabled ?? global.enabled ?? !hidden.includes(key),
    insertion: local.insertion ?? global.insertion ?? 'template',
  };
}

export function applyInsertionMode(page, insertion) {
  if (insertion === 'template') return page;
  return { ...page, elements: page.elements.map(el => ({ ...el, locked: insertion === 'fixed' })) };
}
