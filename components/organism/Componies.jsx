import Image from "next/image";
import BorderSection from "../atom/BorderSection";
import Link from "next/link";

const companies = [
  { name: "dae do", img: "/assets/images/dae do.png" },
  { name: "fila", img: "/assets/images/filla.png" },
  { name: "gr tkd", img: "/assets/images/grimage.png" },
  { name: "mooto", img: "/assets/images/moto.png" },
  { name: "pine tree", img: "/assets/images/pine tree.png" },
  { name: "pro specs", img: "/assets/images/prospecs.png" },
  { name: "addidas", img: "/assets/images/adidas_logo.svg" },
];

function Componies() {
  return (
    <div className="flex flex-col items-center justify-center my-[50px] ">
      <span className="w-[40%] my-[20px] ">
        <BorderSection />
      </span>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {companies.map((company) => (
          <Link
            key={company.name}
            href={`/uniforms-company?company=${encodeURIComponent(company.name)}`}
            title={`Show martial arts uniforms for ${company.name}`}
          >
            <Image
              src={company.img}
              alt={`taekwondo uniform of ${company.name} brand`}
              width={100}
              height={150}
              className="hover:scale-110 transition-transform duration-200"
            />
          </Link>
        ))}
      </div>
      <span className="w-[40%] my-[20px] ">
        <BorderSection />
      </span>
    </div>
  );
}

export default Componies;
