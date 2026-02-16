import { TInput } from "../../ts/types";

const Input = ({
  type,
  text,
  placeholder,
  onChange,
  value,
  name,
  min,
  max,
}: TInput) => {
  return (
    <div className="flex flex-col font-subheader">
      <label htmlFor={name}>{text}</label>
      <input
        type={type}
        name={name}
        className="bg-transparent border-b-[1px] border-white/40 outline-none w-full py-2 invalid:text-red-600 "
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        {...(type === "number" ? { min, max } : {})}
      />
    </div>
  );
};

export default Input;
