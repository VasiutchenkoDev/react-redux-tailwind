import React, { FC, useState } from "react";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useAppDispatch } from "hooks";
import { signIn } from "redux/actions/auth";
import { setUserState } from "redux/reducers/authSlice";
import { Alert } from "../../shared/Alert/Alert";

export interface PageLoginProps {
  className?: string;
}

const loginSocials = [
  {
    name: "Continue with Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Continue with Twitter",
    href: "#",
    icon: twitterSvg,
  },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onChangeForm =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [name]: e.target.value });
      setErrorMessage("");
    };
  const onSubmit = async () => {
    const { email, password } = formData;
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    const { data, errors } = await signIn({ email, password });
    if (errors && errors[0]) {
      setErrorMessage(errors[0].message);
      return;
    }
    if (!data.signIn) {
      setErrorMessage("Unable to login user");
      return;
    }
    dispatch(setUserState(data.signIn));
    navigate("/auth-verification");
  };
  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <Helmet>
        <title>Login || Booking React Template</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="nc-will-change-transform flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <img
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))}
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                value={formData.email}
                onChange={onChangeForm("email")}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Input
                type="password"
                className="mt-1"
                value={formData.password}
                onChange={onChangeForm("password")}
              />
              <Link to="/forgot-pass" className="text-sm">
                Forgot password?
              </Link>
            </label>
            {!!errorMessage && <Alert type="error">{errorMessage}</Alert>}
            <ButtonPrimary onClick={onSubmit}>Continue</ButtonPrimary>
          </div>

          {/* ==== */}
          <span className="block text-center space-x-2 text-neutral-700 dark:text-neutral-300">
            <span>New user?</span>
            <Link to="/signup">Create an account</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
