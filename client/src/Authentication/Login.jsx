import { SignIn } from "@clerk/clerk-react";
import React from "react";
import { dark, neobrutalism, shadesOfPurple } from "@clerk/themes";

const Login = () => {
  return (
    <div>
      <div className="flex flex-grow items-center justify-center h-screen">
        <SignIn
          signUpUrl="/register"
          forceRedirectUrl={"/main"}
          appearance={{
            baseTheme: [shadesOfPurple],
          }}
        />
      </div>
    </div>
  );
};

export default Login;
