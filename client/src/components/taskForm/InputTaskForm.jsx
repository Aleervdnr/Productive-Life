function InputForm({ typeInput, placeholder, name, required, register }) {
    return (
      <input
        type={typeInput}
        placeholder={placeholder}
        className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-44 text-xs font-semibold transition duration-300 ease focus:outline-none focus:border-violet-main autofill:bg-transparent"
        {...register(name, { required: required })}
      />
    );
  }
  
  export default InputForm;