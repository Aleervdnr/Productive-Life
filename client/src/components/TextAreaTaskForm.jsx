
export default function TextAreaTaskForm({
  rows,
  placeholder,
  name,
  register,
}) {
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      className="border border-dark-200 bg-transparent w-full rounded px-[10px] py-[5px] text-xs font-medium transition duration-300 ease focus:outline-none focus:border-violet-main autofill:bg-transparent"
      {...register(name)}
    ></textarea>
  );
}
