import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="absolute top-0 right-0 transform-none">
      <SignUp />
    </div>
  );
}