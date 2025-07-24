const InputField = ({ type = 'text', name, value, onChange, placeholder }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      // style={{padding: "10px 10px"}}
      className="w-full px-[20px] py-2 h-10 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
    />
  );
};

export default InputField;