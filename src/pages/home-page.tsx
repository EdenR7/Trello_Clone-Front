import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { Play } from "lucide-react";
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
    <div
      className="min-h-[94vh] flex text-white"
      style={{
        fontFamily: "var(--font-family-text, 'Charlie Text', sans-serif)",
        backgroundImage: `
      url('https://images.ctfassets.net/rz1oowkt5gyp/7lTGeXbBRNRLaVk2MdBjtJ/99c266ed4cb8cc63bd0c388071f01ff6/white-wave-bg.svg'), 
      linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180))`,
        backgroundPosition: "center bottom -0.5px, 0% 0%",
        backgroundSize: "100% 14%, auto",
        backgroundRepeat: "no-repeat, repeat",
        backgroundAttachment: "scroll, scroll",
        backgroundOrigin: "padding-box, padding-box",
        backgroundClip: "border-box, border-box",
        backgroundColor: "rgb(82, 67, 170)", // As a fallback in case the background fails to load
      }}
    >
      {/* Left half - Content */}
      <div className="w-1/2 p-12 flex items-center">
        <main className="max-w-2xl mx-auto w-full">
          <section className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Trello brings all your tasks, teammates, and tools together
            </h2>
            <p className="text-xl mb-8">
              Keep everything in the same place—even if your team isn’t.
            </p>

            <div className="flex justify-center items-center space-x-4">
              <Input
                type="email"
                placeholder="Email"
                className="flex-grow"
                style={{ width: "70%" }}
              />
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                style={{ width: "30%" }}
                onClick={loginAsNewGuest}
              >
                Explore Trella as a guest
              </Button>
              {/* <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                style={{ width: "30%" }}
              >
                Sign up - it's free!
              </Button> */}
            </div>

            {/* Watch video link with play icon */}
            <div className="mt-4 flex items-center justify-center">
              <a
                href="#"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Watch video
              </a>
              <div className="flex items-center ml-2">
                <span className="bg-blue-600 text-white rounded-full p-1 flex items-center justify-center">
                  <Play className="h-4 w-4" />
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Right half - Image */}
      <div className="w-1/2 bg-transparent">
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
  );
};

export default HomePage;
