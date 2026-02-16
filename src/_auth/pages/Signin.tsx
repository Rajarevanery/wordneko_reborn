import React, { useRef, useState } from "react";
import Input from "../../components/shared/Input";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { TLogin } from "../../ts/types";
import { useLoginUser } from "../../lib/react-query/mutations/mutations";
import HCaptcha from "@hcaptcha/react-hcaptcha";

type TLoginForm = Omit<TLogin, "captchaToken">;

const Signin = () => {
  const [formData, setFormData] = useState<TLoginForm>({
    email: "",
    password: "",
  });

  const [captchaToken, setCaptchaToken] = useState("");
  const captcha = useRef<HCaptcha>(null);

  const navigate = useNavigate();

  const { mutateAsync: loginUser, isPending } = useLoginUser();

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = formData;

    const isFormEmpty = Object.values(formData).some(
      (value) => value === "" || value.length <= 0
    );

    if (isFormEmpty) {
      return toast.error("Please fill in the form provided.");
    }

    if (!captchaToken) {
      return toast.error("Please fill in the captcha.");
    }

    try {
      await loginUser({ email, password, captchaToken });
      captcha?.current?.resetCaptcha();
      toast.success("Successfully Login, good luck have fun!");
      navigate("/games");
    } catch (error) {
      captcha?.current?.resetCaptcha();

      toast.error("Failed to login, wrong credentials.");
      console.error(error);
    }
  };

  return (
    <section className="text-white flex-1 w-full p-6 z-10 flex flex-col bg-slate-900 justify-between">
      <img src="speedle_icon.svg" className="w-16 h-16 mx-auto" alt="" />
      <div className="flex flex-col text-center">
        <h2 className="font-header text-6xl font-bold">Welcome back!</h2>
        <p className="font-paragraph opacity-50">
          Sign in and start the challenge—your next puzzle awaits!
        </p>
      </div>
      <form onSubmit={handleSubmit} className="font-paragraph">
        <fieldset className="space-y-5">
          <Input
            text={"Email"}
            placeholder={"Jonathan@example.com"}
            type={"email"}
            value={formData.email}
            onChange={handleInputs}
            name="email"
            max={undefined}
            min={undefined}
          />
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4">
            <Input
              text={"Password"}
              placeholder={"Enter your password"}
              type={"password"}
              value={formData.password}
              onChange={handleInputs}
              name="password"
              max={undefined}
              min={undefined}
            />
          </div>
        </fieldset>
        <div className="mt-6 flex justify-center items-center">
          <HCaptcha
            ref={captcha}
            theme={"dark"}
            sitekey="45a4fe5e-8d96-4e74-a30c-be0c52d2354e"
            onVerify={setCaptchaToken}
          />
        </div>
        <div className="block text-center space-y-2">
          <button
            type="submit"
            className="mt-10 bg-blue-800 hover:bg-blue-900 transition disabled:bg-blue-950 text-xl w-full font-subheader p-4 rounded-lg text-white text-center"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
      <p className="font-paragraph opacity-50 hover:opacity-100 transition cursor-pointer mx-auto">
        <Link to={"/sign-up"}>Don't have an account?, register here</Link>
      </p>
    </section>
  );
};

export default Signin;
