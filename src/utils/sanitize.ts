// Lightweight client-side HTML sanitizer (defense-in-depth; prefer DOMPurify for stronger guarantees)
// Removes dangerous tags and attributes and neutralizes javascript: URLs.
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  // Create a detached DOM tree to sanitize
  const container = document.createElement('div');
  container.innerHTML = input;

  // Remove dangerous tags entirely
  container.querySelectorAll('script,style,iframe,object,embed,link,meta,noscript').forEach((el) => el.remove());

  // Walk and scrub attributes
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
  while (walker.nextNode()) {
    const el = walker.currentNode as HTMLElement;

    // Remove event handlers (on*) and other risky attrs
    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
      const name = attr.name.toLowerCase();
      const value = (attr.value || '').trim();

      // Remove any inline event handlers
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
        continue;
      }

      // Neutralize javascript: and data: URLs in href/src-like attributes
      if (['href', 'src', 'xlink:href', 'formaction', 'action', 'poster'].includes(name)) {
        const valLower = value.toLowerCase();
        if (valLower.startsWith('javascript:') || valLower.startsWith('data:')) {
          el.removeAttribute(attr.name);
          continue;
        }
      }

      // Remove srcdoc to avoid embedded scripts
      if (name === 'srcdoc') {
        el.removeAttribute(attr.name);
        continue;
      }
    }

    // Strengthen target=_blank links
    if (el.tagName === 'A') {
      const target = el.getAttribute('target');
      if (target === '_blank') {
        const rel = (el.getAttribute('rel') || '').split(/\s+/);
        if (!rel.includes('noopener')) rel.push('noopener');
        if (!rel.includes('noreferrer')) rel.push('noreferrer');
        el.setAttribute('rel', rel.join(' ').trim());
      }
    }
  }

  return container.innerHTML;
}

export default { sanitizeHtml };

