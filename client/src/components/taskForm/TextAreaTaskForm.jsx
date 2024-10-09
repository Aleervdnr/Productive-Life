
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
      className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-56 text-xs font-semibold transition duration-300 ease focus:outline-none focus:border-violet-main autofill:bg-transparent"
      {...register(name)}
    ></textarea>
  );
}
