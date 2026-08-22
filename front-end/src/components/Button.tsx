type componentsButton = {
  title: string;
  variant?: "primary" | "second";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ title, variant = "primary", ...props }: componentsButton) => {
  const primary =
    "w-full cursor-pointer rounded-[5px] border border-[#C92A0E] bg-[#C92A0E] py-2 text-sm font-bold text-white";
  const second =
    "w-full cursor-pointer rounded-[5px] border border-[#C92A0E] bg-white py-2 text-sm font-bold text-[#C92A0E]";

  const choiceButton = () => {
    if (variant === "primary") {
      return primary;
    } else if (variant === "second") {
      return second;
    }
  };

  return (
    <button {...props} className={choiceButton()}>
      {title}
    </button>
  );
};

export default Button;
