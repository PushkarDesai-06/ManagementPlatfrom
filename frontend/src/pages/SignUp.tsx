import React, { useState } from "react";
// import ShinyText from "../blocks/TextAnimations/ShinyText/ShinyText";
import ShinyText from "../blocks/TextAnimations/ShinyText/ShinyText";
import Beams from "../blocks/Backgrounds/Beams/Beams";
import SplitText from "../blocks/TextAnimations/SplitText/SplitText";
const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex gap-4 w-screen min-h-screen bg-blue-500">
      <div className="absolute w-screen h-screen z-0">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>

      <div
        className="flex items-center justify-end flex-1/2 z-10
      "
      >
        <h1 className="font-black text-4xl text-center text-transparent  p-4 px-8 rounded-xl backdrop-blur-2xl border-2 border-neutral-600 bg-gradient-to-r  from-neutral-500/20 via-neutral-300 to-neutral-500/20 bg-clip-text w-64">
          Manage Your Life
        </h1>
      </div>
      <div className="right flex-1/2 flex items-center z-10 ">
        <form
          onSubmit={handleSubmit}
          className=" p-8 border-neutral-600/30 m-4 flex flex-col gap-2 rounded-lg sm:w-sm md:w-lg backdrop-brightness-50 backdrop-blur-lg border-2 "
        >
          <label
            htmlFor="email"
            className="font-bold text-xl text-white/80 drop-shadow-lg drop-shadow-black/20"
          >
            Email
          </label>
          <input
            type="email"
            name=""
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className=" p-2 rounded-md mb-4 text-white/90 ring-1 ring-white/30"
          />
          <label
            htmlFor="password"
            className="font-bold text-xl text-white/80 drop-shadow-lg drop-shadow-black"
          >
            Password
          </label>
          <input
            type="password"
            name=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            placeholder="Enter Password"
            className=" p-2 rounded-md mb-4 text-white/90 ring-1 ring-white/30"
          />
          <div className="flex justify-evenly">
            <button className="bg-green-300/20 rounded-xl">
              <ShinyText
                text="Sign In"
                speed={3}
                disabled={false}
                className="border p-2 px-4 rounded-xl "
              />
            </button>
            <button className="bg-orange-300/20 rounded-xl backdrop-invert">
              <ShinyText
                text="Sign Up"
                speed={3}
                disabled={false}
                className="border p-2 px-4 rounded-xl"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
