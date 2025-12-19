export function Header() {
  return (
    <header className="w-full mb-12 animate-fade-in">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[50vh] flex items-center justify-center group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: 'url(/home.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <h1 className="absolute top-6 left-6 z-10 text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl">
          BK <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Shop</span>
        </h1>
        <p className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-1/2 text-left text-lg md:text-2xl text-gray-200 font-medium leading-relaxed drop-shadow-md">
          Découvrez notre nouvelle collection qui allie style, confort et innovation.
        </p>
        </div>
    </header>
  );
}
