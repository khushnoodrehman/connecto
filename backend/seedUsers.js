const mongoose = require("mongoose");
const User = require("./models/user");

const dbUrl = "mongodb://127.0.0.1:27017/connecto";

const testUsers = [
  {
    name: "Jane Doe",
    email: "jane@example.com",
    username: "jane_doe",
    gender: "female",
    dob: new Date("1996-05-12"),
    bio: "Adventurer, food lover, and developer.",
    rel_status: "Single",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop",
    bg_photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    social_links: { instagram: "jane_adventures", tiktok: "", youtube: "", x: "" }
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    username: "bob_smith",
    gender: "male",
    dob: new Date("1992-08-23"),
    bio: "Coffee addict. Code writer. Dog person.",
    rel_status: "In a relationship",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop",
    bg_photo: "https://images.unsplash.com/photo-1530521951415-3241a6ef4f3d?q=80&w=1200&auto=format&fit=crop",
    social_links: { instagram: "", tiktok: "", youtube: "bobsmith_dev", x: "bob_codes" }
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    username: "alice_j",
    gender: "female",
    dob: new Date("1998-11-04"),
    bio: "Photographer & Digital Artist. Capturing moments.",
    rel_status: "Single",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop",
    bg_photo: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200&auto=format&fit=crop",
    social_links: { instagram: "alice_captures", tiktok: "alice_tok", youtube: "", x: "" }
  }
];

async function seed() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB for seeding...");

    for (let u of testUsers) {
      const exists = await User.findOne({ username: u.username });
      if (exists) {
        console.log(`User ${u.username} already exists, skipping.`);
        continue;
      }
      
      const user = new User(u);
      await User.register(user, "password123");
      console.log(`Registered user: ${u.name} (username: ${u.username})`);
    }

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error seeding:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
