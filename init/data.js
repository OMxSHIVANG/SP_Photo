const sampleImages = [
  {
    title: "Misty Mountain Sunrise",
    image: {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      filename: "sample_nature_1"
    },
    category: "nature",
    tags: ["nature", "mountains", "sunrise", "landscape"]
  },
  {
    title: "Forest Stream in Autumn",
    image: {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
      filename: "sample_nature_2"
    },
    category: "nature",
    tags: ["forest", "autumn", "trees", "stream"]
  },
  {
    title: "Majestic Red Fox in Snow",
    image: {
      url: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80",
      filename: "sample_animals_1"
    },
    category: "animals",
    tags: ["fox", "wildlife", "snow", "nature"]
  },
  {
    title: "Vibrant Tropical Parrot",
    image: {
      url: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&q=80",
      filename: "sample_animals_2"
    },
    category: "animals",
    tags: ["bird", "parrot", "colors", "wildlife"]
  },
  {
    title: "Neon Cyberpunk Girl Illustration",
    image: {
      url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
      filename: "sample_anime_1"
    },
    category: "anime",
    tags: ["anime", "cyberpunk", "illustration", "art"]
  },
  {
    title: "Futuristic Sci-Fi City Night",
    image: {
      url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
      filename: "sample_anime_2"
    },
    category: "anime",
    tags: ["city", "sci-fi", "anime", "neon"]
  },
  {
    title: "Deep Space Nebula & Galaxies",
    image: {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      filename: "sample_universe_1"
    },
    category: "universe",
    tags: ["space", "nebula", "stars", "cosmos"]
  },
  {
    title: "Milky Way Arch Over Desert",
    image: {
      url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
      filename: "sample_universe_2"
    },
    category: "universe",
    tags: ["astronomy", "milkyway", "nightsky", "stars"]
  },
  {
    title: "Modern Architectural Geometry",
    image: {
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      filename: "sample_other_1"
    },
    category: "other",
    tags: ["architecture", "minimal", "design", "building"]
  }
];

module.exports = { data: sampleImages };