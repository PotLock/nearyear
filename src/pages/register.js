// import { PageWithBanner, SpinnerOverlay } from "../components/ui";
import { cn } from "../lib/utils";
// import { useSessionReduxStore } from "../store/session";
// import { useGlobalStoreSelector } from "../store";
import { ProjectEditor } from "@/components/projectEditor";

export default function RegisterPage() {
  return (
    // <PageWithBanner>
    <div className="h-[calc(100vh-214px)] bg-gradient-to-b from-gray-100 to-white">
      <section
        className={cn(
          "flex w-full flex-col items-center gap-3 md:px-10 md:py-8",
          "rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 border border-[#f8d3b0] px-5 py-6 shadow-lg"
        )}
      >
        <h1 className="prose font-500 font-lora text-[32px] leading-[120%] md:text-[40px] text-white">
          {"Register New Project"}
        </h1>
        <h2 className="prose max-w-[600px] text-center md:text-lg text-white">
          {
            "Create a profile for your project to receive donations and qualify for funding rounds."
          }
        </h2>
      </section>
      {/* {showSpinner && <SpinnerOverlay />} */}
      <ProjectEditor />
    </div>
    // </PageWithBanner>
  );
}
