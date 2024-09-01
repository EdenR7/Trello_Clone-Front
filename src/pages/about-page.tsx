import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import unsplashApi from "@/lib/unsplashApi";
import { IUnsplashImage } from "@/types/unsplash.types";

function AboutPage() {
  const [photo, setPhoto] = useState<IUnsplashImage | null>(null);

  const imageSizes = ["full", "raw", "regular", "small", "small_s3", "thumb"];

  return (
    <main>
      <div className="flex flex-col items-center">
        <h1>About</h1>
        <p>
          This is the about page. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Repudiandae quasi quia maiores nobis dignissimos
          temporibus accusamus velit quod, laborum ullam? Accusamus illo maiores
          recusandae possimus at voluptas unde ipsam quod. Iusto harum,
          temporibus ipsa aperiam sed atque. Nam aperiam quos expedita
          laboriosam quae enim, perspiciatis, itaque ipsam quam eaque
          praesentium maiores quibusdam possimus mollitia molestiae. Ipsum
          laborum quia hic beatae blanditiis veritatis nemo reiciendis rerum,
          temporibus dolorum, dolore est quis. Adipisci doloribus error nobis
          saepe ex, commodi officia explicabo maiores?
        </p>

        <div className="uppercase flex gap-4 mt-4">
          <Button asChild>
            <Link to="team">Our Team</Link>
          </Button>
          <Button asChild>
            <Link to="vision">Our Vision</Link>
          </Button>
        </div>

        {/* Render six images of the same photo with different sizes */}

        <div
          className=" h-40 w-40"
          style={{ background: "linear-gradient(to right, #ff7e5f, #feb47b)" }}
        ></div>
      </div>
      <Outlet />
    </main>
  );
}

export default AboutPage;
