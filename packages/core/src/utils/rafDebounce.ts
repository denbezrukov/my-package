export function rafDebounce(notify: VoidFunction) {
  let handle: number | undefined;

  const cancel = () => {
    if (handle) {
      window.cancelAnimationFrame(handle);
    }
  };

  return Object.assign(
    () => {
      cancel();
      handle = window.requestAnimationFrame(notify);
    },
    {
      cancel,
    },
  );
}
