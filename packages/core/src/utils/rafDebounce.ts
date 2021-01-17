// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rafDebounce<T extends (...args: any[]) => void>(notify: T) {
  let handle: number | undefined;

  const cancel = () => {
    if (handle) {
      window.cancelAnimationFrame(handle);
      handle = undefined;
    }
  };

  return Object.assign(
    (...args: Parameters<T>) => {
      cancel();
      handle = window.requestAnimationFrame(() => notify(...args));
    },
    {
      cancel,
    },
  );
}
