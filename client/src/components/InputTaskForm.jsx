function InputTaskForm({ typeInput, placeholder, name, required, register }) {
    return (
      <input
        type={typeInput}
        placeholder={placeholder}
        className="border max-h-[30px] w-full border-dark-200 bg-transparent rounded px-[10px] py-[5px] max-w-44 text-xs font-medium transition duration-300 ease focus:outline-none focus:border-violet-main autofill:bg-transparent"
        {...register(name, { required: required })}
      />
    );
  }
  
  export default InputTaskForm;