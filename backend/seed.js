require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');

const books = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    price: 499,
    stock: 12,
    pages: 309,
    isbn: "9780590353427",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg",
    language: "English",
    description: "An orphaned boy discovers on his eleventh birthday that he is a wizard and is invited to attend Hogwarts School of Witchcraft and Wizardry. As he makes close friends and learns magic, he uncovers the truth about his parents' mysterious deaths."
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    genre: "Fantasy",
    price: 549,
    stock: 8,
    pages: 341,
    isbn: "9780439064873",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780439064873-L.jpg",
    language: "English",
    description: "Harry returns to Hogwarts for his second year, only to find mysterious messages on the castle walls warning that the Chamber of Secrets has been opened. Students are found petrified, and dark forces threaten the school."
  },
  {
    title: "A Game of Thrones",
    author: "George R.R. Martin",
    genre: "Fantasy",
    price: 699,
    stock: 15,
    pages: 694,
    isbn: "9780553103540",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780553103540-L.jpg",
    language: "English",
    description: "Noble families across Westeros vie for control of the Iron Throne as summer ends and winter looms. Meanwhile, an ancient and forgotten menace stirs in the frozen north beyond the Wall."
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    price: 399,
    stock: 20,
    pages: 310,
    isbn: "9780547928227",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
    language: "English",
    description: "Bilbo Baggins, a comfort-loving hobbit, is swept into an epic quest by the wizard Gandalf and a company of thirteen dwarves. Their journey leads them to the Lonely Mountain to reclaim lost treasure from the dragon Smaug."
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    price: 899,
    stock: 6,
    pages: 1178,
    isbn: "9780618640157",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg",
    language: "English",
    description: "Frodo Baggins is entrusted with the One Ring and must journey across Middle-earth to destroy it in the fires of Mount Doom. An extraordinary fellowship unites to fight the rising shadow of Sauron."
  },
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    price: 599,
    stock: 0,
    pages: 662,
    isbn: "9780756404741",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780756404741-L.jpg",
    language: "English",
    description: "Kvothe, a legendary figure, recounts the story of his youth as a gifted musician, arcane student, and fugitive. His search for the mysterious Chandrian drives him to explore forbidden magical arts."
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
    price: 349,
    stock: 14,
    pages: 281,
    isbn: "9780061120084",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
    language: "English",
    description: "Set in a small Alabama town during the Great Depression, lawyer Atticus Finch defends a Black man falsely accused of a crime. His young daughter Scout navigates morality, empathy, and the harsh realities of human prejudice."
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Science Fiction",
    price: 299,
    stock: 18,
    pages: 328,
    isbn: "9780451524935",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    language: "English",
    description: "In a bleak totalitarian state where the Party watches every move, Winston Smith dares to secretly rebel through forbidden love and forbidden thoughts. Big Brother enforces obedience through omnipresent surveillance."
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    price: 249,
    stock: 22,
    pages: 279,
    isbn: "9780141439518",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    language: "English",
    description: "Elizabeth Bennet navigates society, familial expectations, and complicated suitors in nineteenth-century England. Her turbulent relationship with the proud Mr. Darcy challenges both of their preconceptions about love and class."
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    price: 299,
    stock: 0,
    pages: 180,
    isbn: "9780743273565",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
    language: "English",
    description: "During the Roaring Twenties on Long Island, narrator Nick Carraway is drawn into the lavish world of the mysterious Jay Gatsby. Gatsby's relentless obsession with the married Daisy Buchanan leads to an unforgettable American tragedy."
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    price: 649,
    stock: 10,
    pages: 412,
    isbn: "9780441172719",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg",
    language: "English",
    description: "Set on the desert planet Arrakis, young Paul Atreides must navigate political treachery, giant sandworms, and prophecy. He rallies the native Fremen to claim his destiny as the ruler of the universe's most precious spice."
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    genre: "Science Fiction",
    price: 349,
    stock: 9,
    pages: 249,
    isbn: "9781451673319",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg",
    language: "English",
    description: "Guy Montag is a fireman in a future society where books are outlawed and burned on discovery. An unexpected encounter with a curious neighbor forces him to question everything he has been taught about knowledge and control."
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Science Fiction",
    price: 399,
    stock: 11,
    pages: 268,
    isbn: "9780060850524",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg",
    language: "English",
    description: "In a futuristic World State where humans are genetically engineered and pacified by pleasure, Bernard Marx questions conformity. A visit to a primitive reservation brings a clash between engineered harmony and raw human freedom."
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    price: 299,
    stock: 25,
    pages: 208,
    isbn: "9780062315007",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
    language: "English",
    description: "Santiago, an Andalusian shepherd boy, travels across the Egyptian desert in search of treasure buried near the Pyramids. Along the way, he learns to listen to his heart and follow his Personal Legend."
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    genre: "Mystery",
    price: 449,
    stock: 13,
    pages: 489,
    isbn: "9780307474278",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg",
    language: "English",
    description: "Symbologist Robert Langdon and cryptologist Sophie Neveu investigate a murder inside the Louvre Museum. They race across Paris and London deciphering hidden clues left in Leonardo da Vinci's artworks."
  },
  {
    title: "And Then There Were None",
    author: "Agatha Christie",
    genre: "Mystery",
    price: 299,
    stock: 17,
    pages: 272,
    isbn: "9780062073488",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780062073488-L.jpg",
    language: "English",
    description: "Ten strangers are lured to an isolated island mansion by an unknown host, only to be murdered one by one according to a nursery rhyme. With no escape and tension mounting, they must figure out who among them is the killer."
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Mystery",
    price: 399,
    stock: 7,
    pages: 336,
    isbn: "9781250301697",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg",
    language: "English",
    description: "Alicia Berenson's life seems perfect until she shoots her husband five times in the face and never speaks another word. Psychotherapist Theo Faber becomes obsessed with uncovering the truth behind her enduring silence."
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    genre: "Thriller",
    price: 499,
    stock: 0,
    pages: 465,
    isbn: "9780307949486",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780307949486-L.jpg",
    language: "English",
    description: "Journalist Mikael Blomkvist and brilliant hacker Lisbeth Salander team up to solve a decades-old disappearance within a wealthy industrialist family. Their investigation uncovers dark corporate corruption and deeply buried secrets."
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    genre: "Thriller",
    price: 429,
    stock: 8,
    pages: 432,
    isbn: "9780307588371",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg",
    language: "English",
    description: "On their fifth wedding anniversary, Amy Dunne disappears from her Missouri home, and her husband Nick becomes the prime suspect. As the media circus intensifies, shocking deceptions reveal the toxic depths of their marriage."
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "History",
    price: 599,
    stock: 16,
    pages: 443,
    isbn: "9780062316097",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    language: "English",
    description: "An exploration of human history from the emergence of Homo sapiens in the Stone Age up to modern technological revolutions. It examines how biology, myth-making, and economics shaped our global civilization."
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Classic",
    price: 349,
    stock: 14,
    pages: 277,
    isbn: "9780316769488",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg",
    language: "English",
    description: "Sixteen-year-old Holden Caulfield wanders New York City following his expulsion from prep school. Through his cynical yet vulnerable voice, he reflects on alienation, phoniness, and the loss of innocence."
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    genre: "Fiction",
    price: 399,
    stock: 12,
    pages: 371,
    isbn: "9781594631931",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg",
    language: "English",
    description: "Amir, the son of a wealthy merchant in Kabul, is haunted by the guilt of betraying his childhood friend Hassan. Decades later in America, an opportunity arises to return to war-torn Afghanistan and make amends."
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    genre: "Fiction",
    price: 449,
    stock: 10,
    pages: 552,
    isbn: "9780375842207",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg",
    language: "English",
    description: "Narrated by Death, this poignant story follows Liesel Meminger, a young foster girl living near Munich during World War II. She discovers solace in stealing books and sharing them with her neighbors."
  },
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    genre: "Romance",
    price: 299,
    stock: 15,
    pages: 507,
    isbn: "9780141441146",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780141441146-L.jpg",
    language: "English",
    description: "An orphaned young woman overcomes cruelty and poverty to become a governess at Thornfield Hall. She falls in love with the enigmatic Mr. Rochester, only to discover a terrifying secret locked in the attic."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await Book.deleteMany({});
    await User.deleteMany({});

    await Book.insertMany(books);

    await User.create({
      name: 'Admin',
      email: 'admin@bookstore.com',
      password: 'Admin@123',
      role: 'admin'
    });

    await User.create({
      name: 'Customer',
      email: 'customer@bookstore.com',
      password: 'Customer@123',
      role: 'customer'
    });

    console.log(`Seeded ${books.length} books and 2 users.`);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedDB();
