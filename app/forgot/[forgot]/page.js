import ForgotPasswordPage from "@/components/organism/ForgotPasswordPage";

export default async function Page({ params }) {
  const {forgot} = await params;

  return <ForgotPasswordPage tokenn={forgot} />;
}
