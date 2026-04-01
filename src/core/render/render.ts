type Child = string | number | Node | null | undefined | false;
type Attrs = Record<string, string | boolean | EventListener>;

export function h(tag: string, attrs?: Attrs | null, ...children: Child[]): HTMLElement {
  const el = document.createElement(tag);

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (key.startsWith("on") && typeof value === "function") {
        el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      } else if (typeof value === "boolean") {
        if (value) el.setAttribute(key, "");
      } else if (typeof value === "string") {
        el.setAttribute(key, value);
      }
    }
  }

  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    if (typeof child === "string" || typeof child === "number") {
      el.appendChild(document.createTextNode(String(child)));
    } else {
      el.appendChild(child);
    }
  }

  return el;
}

export function mount(parent: HTMLElement, child: Node): void {
  parent.appendChild(child);
}

export function clear(el: HTMLElement): void {
  el.innerHTML = "";
}

export function on(el: HTMLElement, event: string, handler: EventListener): () => void {
  el.addEventListener(event, handler);
  return () => el.removeEventListener(event, handler);
}
