type componentsButton = {
  title: string;
  variant?: "primary" | "second" | "thirty" | string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ title, variant = "primary", ...props }: componentsButton) => {
  const primary =
    "w-full cursor-pointer rounded-[5px] border border-[#C92A0E] bg-[#C92A0E] py-2 text-sm font-bold text-white";
  const second =
    "w-full cursor-pointer rounded-[5px] border border-[#C92A0E] bg-white py-2 text-sm font-bold text-[#C92A0E]";
  const thirty =
    "bg flex h-7 w-25.25 items-center justify-center rounded-md bg-[#161410] md:h-8.75 md:w-32.5 text-sm md:text-md cursor-pointer border border-[#F2DAAC] hover:bg-[#F2DAAC] hover:text-[#161410]";
  const forty =
    "bg flex h-7 w-25.25 items-center justify-center rounded-md bg-[#F2DAAC] md:h-8.75 md:w-32.5 text-sm md:text-md cursor-pointer border border-[#F2DAAC] text-[#161410]";

  const choiceButton = () => {
    if (variant === "primary") {
      return primary;
    } else if (variant === "second") {
      return second;
    } else if (variant === "thirty") {
      return thirty;
    } else if (variant === "forty") {
      return forty;
    }
  };

  return (
    <button {...props} className={choiceButton()}>
      {title}
    </button>
  );
};

export default Button;
