// import { PageWithBanner, SpinnerOverlay } from "../components/ui";
import { cn } from "../lib/utils";
// import { useSessionReduxStore } from "../store/session";
// import { useGlobalStoreSelector } from "../store";
import { ProjectEditor } from "@/components/projectEditor";

export default function RegisterPage() {
  

  return (
    // <PageWithBanner>
      <div className="h-lvh">
          <section
            className={cn(
              "flex w-full flex-col items-center gap-3 md:px-10 md:py-8",
              "2xl-rounded-lg bg-hero border-[#f8d3b0] px-5 py-6",
            )}
          >
            <h1 className="prose font-500 font-lora text-[32px] leading-[120%] md:text-[40px]">
              {"Register New Project"}
            </h1>
            <h2 className="prose max-w-[600px] text-center md:text-lg">
              {"Create a profile for your project to receive donations and qualify for funding rounds."}
            </h2>
          </section>
          {/* {showSpinner && <SpinnerOverlay />} */}
          <ProjectEditor />
      </div>
    // </PageWithBanner>
  );
}
