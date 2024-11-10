import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="top-0 transform-none">
      <SignIn />
    </div>
  );
}