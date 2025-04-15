import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

function InputFormPassword({
  typeInput,
  placeholder,
  name,
  required,
  register,
  tabIndexValue,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [inputLength, setInputLength] = useState(false)


const handleOnChange = (e) => {
  if(e.target.value.length > 0){
    setInputLength(true)
  }else{
    setInputLength(false)
    setShowPassword(false)
  }
}

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full border border-dark-200 bg-transparent rounded h-11 p-5 text-xs font-semibold transition duration-300 ease focus:outline-none focus:border-violet-main autofill:bg-transparent"
        tabIndex={tabIndexValue}
        {...register(name, { required: required })}
        required
        onChange={(e) => handleOnChange(e)}
        min={6}
      />
      <div
        className={`${inputLength ? "absolute" : "hidden"} top-[50%] translate-y-[-50%]  right-5 cursor-pointer`}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword == true ? <IoMdEyeOff /> : <IoMdEye />}
      </div>
    </div>
  );
}

export default InputFormPassword;
