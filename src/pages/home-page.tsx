import Carousel from "@/components/HomePages/carousel";
import { Button } from "@/components/ui/button";
import { LoaderModal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";

const HomePage: React.FC = () => {
  const [isPending, setIsPending] = useState(false);
  const { loginAsGuest } = useAuth();
  const { toast } = useToast();

  async function loginAsNewGuest() {
    try {
      setIsPending(true);
      const guestUsername = await loginAsGuest();
      toast({
        title: `Logged in as a ${guestUsername}`,
        description: `You can now explore Trella as ${guestUsername}!`,
      });
    } catch (error: any) {
      toast({
        title: "Sorry an unexpected error occurred",
        description: "Please try again later...",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <div
        style={{
          backgroundImage: `
    url('https://images.ctfassets.net/rz1oowkt5gyp/7lTGeXbBRNRLaVk2MdBjtJ/99c266ed4cb8cc63bd0c388071f01ff6/white-wave-bg.svg'), 
    linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180))`,
          backgroundPosition: "center bottom -0.5px, 0% 0%",
          backgroundSize: "100% 14%, auto",
          backgroundRepeat: "no-repeat, repeat",
          backgroundAttachment: "scroll, scroll",
          backgroundOrigin: "padding-box, padding-box",
          backgroundClip: "border-box, border-box",
          backgroundColor: "rgb(82, 67, 170)",
        }}
      >
        <div
          className="min-h-[70vh] flex-col break-1000px:flex-row items-center mx-auto break-600px:max-w-[540px] break-800px:max-w-[720px]  break-1000px:max-w-[960px] break-1200px:max-w-[1140px] break flex text-white"
          style={{
            fontFamily: "var(--font-family-text, 'Charlie Text', sans-serif)",
          }}
        >
          {/* Left half - Content */}
          <div className="break-1000px:w-1/2 w-full p-12 pt-32 flex items-center">
            <main className="max-w-2xl mx-auto w-full">
              <section className="text-center">
                <h2 className="break-1000px:text-4xl text-2xl font-[600] mb-4 break-1000px:text-left">
                  Trello brings all your tasks, teammates, and tools together
                </h2>
                <p className="text-xl mb-8 break-1000px:text-left">
                  Keep everything in the same place—even if your team isn’t.
                </p>

                <div className="flex justify-center items-center space-x-4">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap w-full px-4 pt-[0.7rem] pb-[0.8rem] "
                    disabled={isPending}
                    onClick={loginAsNewGuest}
                  >
                    Explore Trella as a guest
                  </Button>
                </div>
              </section>
            </main>
          </div>

          {/* Right half - Image */}
          <div className="break-1000px:w-[58.3333%]  w-full break-1000px:pt-32  pt-4 pb-0 bg-transparent relative -mb-2 break-1000px:mb-0 ">
            {" "}
            {/* Set transparent background here */}
            <img
              src={
                "https://images.ctfassets.net/rz1oowkt5gyp/75rDABL8fyMtNLlUAtBxrg/c5e145977a86c41c47e17c69410c64f7/TrelloUICollage_4x.png?w=1080"
              } // Use the imported image
              alt="Trello UI Collage"
              className="w-full h-full object-cover bg-transparent"
            />
          </div>
        </div>
      </div>
      <div
        style={{
          background:
            "linear-gradient(0deg,  rgb(230, 252, 255), rgb(255, 255, 255) )",
          backgroundColor: "rgb(178, 212, 255)",
        }}
      >
        {/* Text section */}

        <div className=" px-4 break-800px:px-0 break-600px:max-w-[540px] break-800px:max-w-[720px]  break-1000px:max-w-[960px] break-1200px:max-w-[1140px] mx-auto p4 ">
          <div className="-ml-4">
            <div className="w-full break-800px:w-[58.333%]">
              <div>
                <p className="mb-2 font-semibold leading-5 text-lg">
                  Trello 101
                </p>
                <h2 className="pb-2 break-800px:pb-4 break-800px:text-4xl font-semibold">
                  A productivity powerhouse
                </h2>
              </div>

              <div>
                <p className="text-xl">
                  Simple, flexible, and powerful. All it takes are boards,
                  lists, and cards to get a clear view of who’s doing what and
                  what needs to get done.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Carousel />
      </div>
      <LoaderModal display={isPending} />
    </>
  );
};

export default HomePage;
