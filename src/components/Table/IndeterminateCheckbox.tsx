import { HTMLProps, useEffect, useRef } from "react";

function IndeterminateCheckbox({
  indeterminate,
  className = "h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

export default IndeterminateCheckbox;
