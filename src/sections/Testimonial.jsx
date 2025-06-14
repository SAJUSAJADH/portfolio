import { twMerge } from "tailwind-merge";
import Marquee from "../components/Marquee";
import { journey } from "../constants";
const firstRow = journey.slice(0, journey.length / 2);
const secondRow = journey.slice(journey.length / 2);

const ReviewCard = ({ title, year, content }) => {
  return (
    <figure
      className={twMerge(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-50/[.1] bg-gradient-to-r bg-indigo to-storm hover:bg-royal hover-animation"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-white">
            {title}
          </figcaption>
          <p className="text-xs font-medium text-white/40">{year}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{content}</blockquote>
    </figure>
  );
};

export default function Testimonial() {
  return (
    <div className="items-start mt-25 md:mt-35 c-space">
      <h2 className="text-heading">My Journey</h2>
      <div className="relative flex flex-col items-center justify-center w-full mt-12 overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((journey) => (
            <ReviewCard key={journey.title} {...journey} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((journey) => (
            <ReviewCard
              key={journey.title}
              title={journey.title}
              year={journey.year}
              content={journey.content}
            />
          ))}
        </Marquee>
        <div className="absolute inset-y-0 left-0 w-1/4 pointer-events-none bg-gradient-to-r from-primary"></div>
        <div className="absolute inset-y-0 right-0 w-1/4 pointer-events-none bg-gradient-to-l from-primary"></div>
      </div>
    </div>
  );
}
