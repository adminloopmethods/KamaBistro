const InputField = ({ type = 'text', name, value, onChange, placeholder }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      // style={{padding: "10px 10px"}}
      className="w-full px-[10px] py-2 h-10 border rounded-md focus:outline-none focus:ring focus:border-blue-100 focus:ring-2"
    />
  );
};

export default InputField;