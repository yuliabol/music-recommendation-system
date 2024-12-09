import React from 'react';
import './Categories.css';

const Categories = () => {
  const categories = [
    { id: 1, name: "Dance Hits", image: "path-to-dance-hits.jpg" },
    { id: 2, name: "Soft Pop Hits", image: "path-to-soft-pop.jpg" },
  ];

  return (
    <div className="categories">
      {categories.map(category => (
        <div key={category.id} className="category">
          <img src={category.image} alt={category.name} />
          <h4>{category.name}</h4>
        </div>
      ))}
    </div>
  );
};

export default Categories;
