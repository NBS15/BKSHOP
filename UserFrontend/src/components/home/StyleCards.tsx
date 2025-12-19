interface StyleCardsProps {
  onSelectCategory: (category: string) => void;
}

export function StyleCards({ onSelectCategory }: StyleCardsProps) {
  const styles = [
    { name: 'Hoodie', image: '/hoodies.jpg' },
    { name: 'Polo', image: '/polo.jpg' },
    { name: 'T-shirt', image: '/t_shirt.jpg' },
    { name: 'Casquette', image: '/casquette.png' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-16">
      {styles.map((style, index) => (
        <div
          key={style.name}
          className="group relative h-64 sm:h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
          onClick={() => onSelectCategory(style.name)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gray-200">
            <img 
              src={style.image} 
              alt={style.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-white mb-2">{style.name}</h3>
            <div className="w-12 h-1 bg-primary mb-3 rounded-full transition-all duration-300 group-hover:w-20" />
            <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              Découvrir la collection →
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
