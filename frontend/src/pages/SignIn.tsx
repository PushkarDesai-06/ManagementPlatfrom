import React, { useState } from "react";
import SplitText from "../components/SplitText";
import ShinyText from "../blocks/TextAnimations/ShinyText/ShinyText";
// import RotatingText from "../blocks/TextAnimations/RotatingText/RotatingText";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex gap-4 w-screen min-h-screen bg-blue-500">
      <div
        className="flex items-center flex-1/2
      "
      >
        <h1 className="font-black text-4xl text-right w-full">
          Manage Your Life
        </h1>
      </div>
      <div className="right flex-1/2 flex items-center">
        <form
          onSubmit={handleSubmit}
          className=" p-8 border-neutral-600 m-4 flex flex-col gap-2 rounded-lg bg-amber-50 sm:w-sm md:w-lg"
        >
          <label htmlFor="email" className="font-bold text-xl">
            Email
          </label>
          <input
            type="email"
            name=""
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border p-2 rounded-md mb-4"
          />
          <label htmlFor="password" className="font-bold text-xl">
            Password
          </label>
          <input
            type="password"
            name=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            placeholder="Enter Password"
            className="p-2 border rounded-md"
          />
          <div className="flex justify-evenly">
            <button>
              <ShinyText
                text="Sign In"
                speed={3}
                disabled={false}
                className="custom-class cursor-pointer"
              />
            </button>
            <button type="button">
              <ShinyText
                text="Sign Up"
                speed={3}
                disabled={false}
                className="custom-class cursor-pointer"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
