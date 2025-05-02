// mockData.js

// Mock data for the current user
export const mockCurrentUser = {
  id: "1",
  name: "Alex Johnson",
  username: "alexjourneys",
  avatar: "/placeholder.svg",
  bio: "Travel enthusiast exploring the world one city at a time ✈️",
  location: "Currently in: Tokyo, Japan",
  joinedDate: new Date("2024-01-15"),
  placesVisited: 27,
  followers: 148,
  following: 92,
  interests: ["Photography", "Hiking", "Food", "Culture"]
};


export const mockTravelTips = [
  {
    id: "1",
    title: "Essential Packing Tips",
    content: "Always roll your clothes instead of folding them to save space and prevent wrinkles.",
    category: "Packing",
    author: mockCurrentUser,
    likes: 24
  },
  {
    id: "2",
    title: "Japan Travel Etiquette",
    content: "Remember to remove your shoes before entering homes and many traditional establishments.",
    category: "Culture",
    author: mockCurrentUser,
    likes: 35
  }
];

const mockJournalEntries = [
  {
    id: "1",
    title: "Cherry Blossom Season in Kyoto",
    content: "Experiencing the magical hanami season in Japan's cultural capital...",
    location: "Kyoto, Japan",
    date: new Date("2024-04-05"),
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      "https://images.unsplash.com/photo-1493997181344-712f2f19d87a"
    ],
    tags: ["Japan", "Culture", "Spring", "Nature"],
    isPrivate: false,
    author: mockCurrentUser,
    likes: 127,
    comments: 23,
    coordinates: {
      lat: 35.0116,
      lng: 135.7681
    }
  }
];

// User profile card in plain JS
function createUserProfileCard(user) {
  const container = document.createElement("div");

  const img = document.createElement("img");
  img.src = user.avatar;
  img.alt = `${user.name}'s avatar`;

  const name = document.createElement("h2");
  name.textContent = `${user.name} (@${user.username})`;

  const bio = document.createElement("p");
  bio.textContent = user.bio;

  const location = document.createElement("p");
  location.textContent = user.location;

  const visited = document.createElement("p");
  visited.textContent = `Places Visited: ${user.placesVisited}`;

  const followers = document.createElement("p");
  followers.textContent = `Followers: ${user.followers}`;

  container.append(img, name, bio, location, visited, followers);
  return container;
}

// Travel tip card in plain JS
function createTravelTipCard(tip) {
  const card = document.createElement("div");

  const title = document.createElement("h3");
  title.textContent = tip.title;

  const content = document.createElement("p");
  content.textContent = tip.content;

  const category = document.createElement("p");
  category.textContent = `Category: ${tip.category}`;

  const likes = document.createElement("p");
  likes.textContent = `Likes: ${tip.likes}`;

  card.append(title, content, category, likes);
  return card;
}

// Render to page
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");

  const profileCard = createUserProfileCard(mockCurrentUser);
  root.appendChild(profileCard);

  mockTravelTips.forEach((tip) => {
    const tipCard = createTravelTipCard(tip);
    root.appendChild(tipCard);
  });
});
