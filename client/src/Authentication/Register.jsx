import { SignUp } from "@clerk/clerk-react";
import React from "react";
import { dark, neobrutalism, shadesOfPurple } from "@clerk/themes";

const Register = () => {
  return (
    <div className="flex flex-grow items-center justify-center h-screen">
      <SignUp
        signInUrl="/login"
        forceRedirectUrl={"/main"}
        appearance={{
          baseTheme: [shadesOfPurple],
        }}
      />
    </div>
  );
};

export default Register;
