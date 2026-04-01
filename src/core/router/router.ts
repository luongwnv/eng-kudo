type RenderFn = (params: Record<string, string>) => HTMLElement;

interface RouteConfig {
  path: string;
  render: RenderFn;
  onEnter?: () => void;
  onLeave?: () => void;
}

interface Router {
  register: (routes: RouteConfig[]) => void;
  navigate: (path: string) => void;
  getCurrentPath: () => string;
  destroy: () => void;
}

let instance: Router | null = null;

export function createRouter(mountEl: HTMLElement): Router {
  const routes: RouteConfig[] = [];
  let currentRoute: RouteConfig | null = null;

  function parsePath(): { path: string; params: Record<string, string> } {
    const hash = window.location.hash.slice(1) || "/";
    const [path, query] = hash.split("?");
    const params: Record<string, string> = {};
    if (query) {
      new URLSearchParams(query).forEach((v, k) => {
        params[k] = v;
      });
    }
    return { path, params };
  }

  function matchRoute(path: string): RouteConfig | undefined {
    return routes.find((r) => r.path === path);
  }

  function render(): void {
    const { path, params } = parsePath();
    const route = matchRoute(path);

    if (currentRoute?.onLeave) currentRoute.onLeave();

    mountEl.innerHTML = "";

    if (route) {
      currentRoute = route;
      const el = route.render(params);
      mountEl.appendChild(el);
      if (route.onEnter) route.onEnter();
    } else {
      // 404 - redirect to home
      navigate("/");
    }
  }

  function navigate(path: string): void {
    window.location.hash = path;
  }

  function onHashChange(): void {
    render();
  }

  window.addEventListener("hashchange", onHashChange);

  function register(newRoutes: RouteConfig[]): void {
    routes.push(...newRoutes);
    render();
  }

  function getCurrentPath(): string {
    return parsePath().path;
  }

  function destroy(): void {
    window.removeEventListener("hashchange", onHashChange);
  }

  instance = { register, navigate, getCurrentPath, destroy };
  return instance;
}

export function navigate(path: string): void {
  if (instance) {
    instance.navigate(path);
  } else {
    window.location.hash = path;
  }
}

export function getCurrentPath(): string {
  return instance?.getCurrentPath() ?? "/";
}
