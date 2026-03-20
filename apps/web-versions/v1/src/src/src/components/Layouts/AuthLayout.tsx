import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="text-black dark:text-white-dark min-h-screen">
            {children}
        </div>
    );
};

export default AuthLayout;