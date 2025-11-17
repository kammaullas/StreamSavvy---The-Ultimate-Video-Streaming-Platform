// src/components/Banner.jsx
export default function Banner({ movie }) {
  if (!movie) {
    return (
<div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full bg-cover bg-center">
        <h1 className="text-5xl font-extrabold text-royal-200">
          StreamSavvy
        </h1>
      </div>
    );
  }

  return (
    <div
      className="
        relative h-[70vh]
        bg-cover bg-center bg-no-repeat
      "
      style={{
        backgroundImage: `linear-gradient(
          180deg, rgba(11, 2, 19, 0.0), rgba(11, 2, 19, 0.9)
        ), url(${movie.poster})`,
      }}
    >
      {/* Text */}
      <div className="absolute bottom-20 left-10 max-w-xl">
        <h1 className="text-5xl font-bold mb-3 text-white drop-shadow-xl">
          {movie.title}
        </h1>

        <p className="text-gray-300 text-lg max-w-xl line-clamp-3 mb-5">
          {movie.description}
        </p>

        <div className="flex gap-4">
          <button className="btn-purple px-6 py-2 font-semibold">
            ▶ Play
          </button>
          <button className="btn-outline-purple px-6 py-2">
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}
