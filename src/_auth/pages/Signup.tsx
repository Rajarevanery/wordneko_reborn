import React, { useRef, useState } from "react";
import Input from "../../components/shared/Input";
import { toast } from "sonner";
import { TRegister } from "../../ts/types";
import { Link, useNavigate } from "react-router";
import { useRegisterUser } from "../../lib/react-query/mutations/mutations";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const Signup = () => {
  const [formData, setFormData] = useState<TRegister>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [captchaToken, setCaptchaToken] = useState("");
  const captcha = useRef<HCaptcha>(null);

  const navigate = useNavigate();

  const { mutateAsync: postUser, isPending } = useRegisterUser();

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password, confirmPassword, firstName, lastName } = formData;

    const isFormEmpty = [email, password, confirmPassword, firstName].some(
      (value) => value.trim() === ""
    );

    // const isFormEmpty = Object.values(formData).some(
    //   (value) => value === "" || value.length <= 0
    // );

    const isConfirmed = password === confirmPassword;

    if (isFormEmpty) {
      return toast.error("Please fill in the form provided.");
    }

    if (!isConfirmed) {
      return toast.error("Please double-check your password.");
    }

    if (!captchaToken) {
      return toast.error("Please fill in the captcha.");
    }

    try {
      await postUser({
        email,
        password,
        firstName,
        lastName: lastName.trim() || "",
        captchaToken,
      });

      toast.success("Successfully Registered");
      navigate("/games");
      captcha?.current?.resetCaptcha();
    } catch (error) {
      console.log(error);
      captcha?.current?.resetCaptcha();
    }
  };

  return (
    <section className="text-white flex-1 w-full p-6 z-10 flex flex-col bg-slate-900 justify-between">
      <img src="speedle_icon.svg" className="w-16 h-16 mx-auto" alt="" />
      <div className="flex flex-col text-center">
        <h2 className="font-header text-4xl 2xl:text-6xl font-bold">
          Create an Account
        </h2>
        <p className="font-paragraph opacity-50">
          Sign up and start the challenge—your next puzzle awaits!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="font-paragraph">
        <fieldset className="space-y-5 flex flex-col justify-between ">
          <Input
            text={"Display Name"}
            placeholder={"Zachy"}
            type={"text"}
            value={formData.firstName}
            onChange={handleInputs}
            name="firstName"
            max={undefined}
            min={undefined}
          />
          <Input
            text={"Last Name (Optional)"}
            placeholder={"Lane"}
            type={"text"}
            value={formData.lastName}
            onChange={handleInputs}
            name="lastName"
            max={undefined}
            min={undefined}
          />
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
              placeholder={"minimum of 6 letters."}
              type={"password"}
              value={formData.password}
              onChange={handleInputs}
              name="password"
              max={undefined}
              min={undefined}
            />
            <Input
              text={"Confirm Password"}
              placeholder={"Confirm your password."}
              type={"password"}
              value={formData.confirmPassword}
              onChange={handleInputs}
              name="confirmPassword"
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
            disabled={isPending}
            className="mt-10 bg-blue-800 hover:bg-blue-900 transition disabled:bg-blue-950 text-xl w-full font-subheader p-4 rounded-lg text-white text-center"
          >
            {isPending ? "Registering your account..." : "Register"}
          </button>
        </div>
      </form>
      <p className="font-paragraph opacity-50 hover:opacity-100 transition cursor-pointer mx-auto">
        <Link to={"/sign-in"}>Have an account?, log in here</Link>
      </p>
    </section>
  );
};

export default Signup;
