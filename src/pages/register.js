// import { PageWithBanner, SpinnerOverlay } from "../components/ui";
import { cn } from "../lib/utils";
// import { useSessionReduxStore } from "../store/session";
// import { useGlobalStoreSelector } from "../store";
import { ProjectEditor } from "@/components/projectEditor";

export default function RegisterPage() {
//   const { isAuthenticated } = useSessionReduxStore();
//   useInitProjectState();

  // state used to show spinner during the data post
//   const { submissionStatus, checkRegistrationStatus, checkPreviousProjectDataStatus } =
//     useGlobalStoreSelector((state) => state.projectEditor);

//   const showSpinner = isAuthenticated
//     ? submissionStatus === "sending" ||
//       checkRegistrationStatus !== "ready" ||
//       checkPreviousProjectDataStatus !== "ready"
//     : false;

  return (
    // <PageWithBanner>
      <div>
          <section
            className={cn(
              "flex w-full flex-col items-center gap-8 md:px-10 md:py-16",
              "2xl-rounded-lg bg-hero border-[#f8d3b0] px-5 py-12",
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
