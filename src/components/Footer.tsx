import { BsHeartFill } from "react-icons/bs";
import { CgCoffee } from "react-icons/cg";

const Footer = () => {
  return (
    <footer className="w-full py-4 bg-slate-900 border-t border-white/40 items-center flex flex-col justify-center text-white text-center relative min-h-[4rem]">
      <div>
        <span className="flex flex-row gap-2 items-center text-xl font-subheader">
          Made with{" "}
          <i className="text-red-600 animate-pulse">
            <BsHeartFill />
          </i>{" "}
          by <span className="text-blue-500">zoneeox</span>
        </span>
      </div>
      <div>
        <ul className="mt-2 flex flex-row gap-4">
          <a href="https://ko-fi.com/I2I51ABB9X" target="_blank">
            <li className="text-lg flex flex-row items-center gap-2 bg-slate-950 hover:bg-transparent border hover:border-white/40 transition cursor-pointer px-2 rounded-lg font-paragraph">
              Support me
              <i className="text-2xl">
                <CgCoffee />
              </i>
            </li>
          </a>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
