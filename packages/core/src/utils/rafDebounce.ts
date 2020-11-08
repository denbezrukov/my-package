export function rafDebounce(notify: VoidFunction) {
  let handle: number | undefined;

  const cancel = () => {
    if (handle) {
      window.cancelAnimationFrame(handle);
      handle = undefined;
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
