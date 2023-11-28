import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { twoFactorVerification } from "redux/actions/auth";
import { useAppDispatch, useAppSelector } from "hooks";
import { setUserState } from "redux/reducers/authSlice";
import { useIsMount } from "hooks/useIsMount";
import { Alert } from "shared/Alert/Alert";

export interface PageSignUpVerificationProps {
  className?: string;
}

const PageSignInVerification: FC<PageSignUpVerificationProps> = ({
  className = "",
}) => {
  const [formData, setFormData] = useState({
    firstNumber: "",
    secondNumber: "",
    thirdNumber: "",
    fourthNumber: "",
  });
  const firstNumberRef = useRef<HTMLInputElement>(null);
  const secondNumberRef = useRef<HTMLInputElement>(null);
  const thirdNumberRef = useRef<HTMLInputElement>(null);
  const fourthNumberRef = useRef<HTMLInputElement>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const isMount = useIsMount();

  useEffect(() => {
    if (isMount && !user.verificationToken) {
      navigate("/login");
    }
  }, [user.verificationToken]);
  useEffect(() => {
    const { firstNumber, secondNumber, thirdNumber, fourthNumber } = formData;
    if (firstNumber && secondNumber && thirdNumber && fourthNumber) {
      onSubmit();
    }
  }, [formData.fourthNumber]);
  const onChangeForm =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (
        (name === "firstNumber" &&
          formData.firstNumber.length &&
          value.length) ||
        (name === "secondNumber" &&
          formData.secondNumber.length &&
          value.length) ||
        (name === "thirdNumber" &&
          formData.thirdNumber.length &&
          value.length) ||
        (name === "fourthNumber" &&
          formData.fourthNumber.length &&
          value.length)
      ) {
        return;
      }

      setFormData({ ...formData, [name]: value });
      setErrorMessage("");
      if (name === "firstNumber" && secondNumberRef.current) {
        secondNumberRef.current.focus();
      }
      if (name === "secondNumber" && thirdNumberRef.current) {
        thirdNumberRef.current.focus();
      }
      if (name === "thirdNumber" && fourthNumberRef.current) {
        fourthNumberRef.current.focus();
      }
      if (name === "fourthNumber" && firstNumberRef.current) {
        firstNumberRef.current.focus();
      }
    };
  const onSubmit = async () => {
    const { firstNumber, secondNumber, thirdNumber, fourthNumber } = formData;
    if (!firstNumber || !secondNumber || !thirdNumber || !fourthNumber) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    const code = `${firstNumber}${secondNumber}${thirdNumber}${fourthNumber}`;
    const { data, errors } = await twoFactorVerification(
      code,
      user.verificationToken
    );
    if (errors && errors[0]) {
      setErrorMessage(errors[0].message);
      return;
    }
    if (!data.twoFactorVerification) {
      setErrorMessage("Unable to login user");
      return;
    }
    dispatch(
      setUserState({ ...data.twoFactorVerification, isAuthenticated: true })
    );
    localStorage.setItem("authToken", data.twoFactorVerification.authToken);
    navigate("/");
  };
  return (
    <div
      className={`nc-PageSignInVerification  ${className}`}
      data-nc-id="PageSignInVerification"
    >
      <Helmet>
        <title>Sign up || Booking React Template</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Sign In Verification
        </h2>
        <div className="max-w-xs mx-auto space-y-6 ">
          <div className="grid grid-cols-4 gap-6">
            <Input
              type="text"
              ref={firstNumberRef}
              className="mt-1"
              value={formData.firstNumber}
              onChange={onChangeForm("firstNumber")}
            />
            <Input
              type="text"
              ref={secondNumberRef}
              className="mt-1"
              value={formData.secondNumber}
              onChange={onChangeForm("secondNumber")}
            />
            <Input
              type="text"
              ref={thirdNumberRef}
              className="mt-1"
              value={formData.thirdNumber}
              onChange={onChangeForm("thirdNumber")}
            />
            <Input
              type="text"
              ref={fourthNumberRef}
              className="mt-1"
              value={formData.fourthNumber}
              onChange={onChangeForm("fourthNumber")}
            />
          </div>
          <div className="grid grid-cols-1 gap-6">
            {!!errorMessage && <Alert type="error">{errorMessage}</Alert>}
            <ButtonPrimary onClick={onSubmit}>Continue</ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSignInVerification;
