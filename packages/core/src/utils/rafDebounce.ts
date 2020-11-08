export function rafDebounce(notify: VoidFunction) {
  let handle: number;

  const cancel = () => window.cancelAnimationFrame(handle);

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
