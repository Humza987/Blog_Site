import * as React from "react";
import { Link } from "react-router-dom";
import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
const NavBar = () => {
  const { user } = useUser();
  return (
    <>
      <div className="Links">
        <div className="side">
          <Link to="/"> Home </Link>
          {user && <Link to="create-post"> Create a Post</Link>}
        </div>
        <div className="title">Blog</div>
        <div className="otherside">
          {user && "user: " && 
          "@"+user?.username + "  "} 
          <SignedIn>
            <SignOutButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </>
  );
};

export default NavBar;
