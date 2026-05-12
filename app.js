const mongoose = require('mongoose');
require('dotenv').config();

// Person Schema
const personSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number, 
    default: 0 
  },
  favoriteFoods: { 
    type: [String], 
    default: [] 
  }
});

const Person = mongoose.model('Person', personSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  
  // Run examples after connection
  runExamples();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// All operations
async function runExamples() {
  
  // 1. Create and Save a Record
  const createAndSavePerson = () => {
    const person = new Person({
      name: "John Doe",
      age: 30,
      favoriteFoods: ["pizza", "pasta"]
    });
    
    person.save((err, data) => {
      if (err) console.error(err);
      else console.log("✅ Person saved:", data);
    });
  };
  
  // 2. Create Many Records
  const createManyPeople = () => {
    const arrayOfPeople = [
      { name: "Alice", age: 25, favoriteFoods: ["sushi", "ramen"] },
      { name: "Bob", age: 32, favoriteFoods: ["steak", "burritos"] },
      { name: "Mary", age: 28, favoriteFoods: ["salad", "burritos"] }
    ];
    
    Person.create(arrayOfPeople, (err, data) => {
      if (err) console.error(err);
      else console.log("✅ Multiple people created:", data);
    });
  };
  
  // 3. Find people by name
  const findPeopleByName = (personName) => {
    Person.find({ name: personName }, (err, data) => {
      if (err) console.error(err);
      else console.log(`✅ People named ${personName}:`, data);
    });
  };
  
  // 4. Find one person by favorite food
  const findOneByFood = (food) => {
    Person.findOne({ favoriteFoods: food }, (err, data) => {
      if (err) console.error(err);
      else console.log(`✅ Person who likes ${food}:`, data);
    });
  };
  
  // 5. Find by ID
  const findPersonById = (personId) => {
    Person.findById(personId, (err, data) => {
      if (err) console.error(err);
      else console.log(`✅ Person with ID ${personId}:`, data);
    });
  };
  
  // 6. Find, Edit, then Save (add hamburger to favorites)
  const findEditThenSave = (personId) => {
    Person.findById(personId, (err, person) => {
      if (err) console.error(err);
      else {
        person.favoriteFoods.push("hamburger");
        person.save((err, updatedPerson) => {
          if (err) console.error(err);
          else console.log("✅ Updated person (added hamburger):", updatedPerson);
        });
      }
    });
  };
  
  // 7. Find and Update (set age to 20)
  const findAndUpdate = (personName) => {
    Person.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true },
      (err, updatedPerson) => {
        if (err) console.error(err);
        else console.log(`✅ Updated ${personName}'s age to 20:`, updatedPerson);
      }
    );
  };
  
  // 8. Delete by ID
  const removeById = (personId) => {
    Person.findByIdAndRemove(personId, (err, removedPerson) => {
      if (err) console.error(err);
      else console.log("✅ Removed person:", removedPerson);
    });
  };
  
  // 9. Delete many with name "Mary"
  const removeManyPeople = () => {
    Person.remove({ name: "Mary" }, (err, result) => {
      if (err) console.error(err);
      else console.log("✅ Removed Mary(s):", result);
    });
  };
  
  // 10. Chain search (people who like burritos, sort by name, limit to 2, hide age)
  const queryChain = () => {
    Person.find({ favoriteFoods: "burritos" })
      .sort({ name: 1 })
      .limit(2)
      .select({ age: 0 })
      .exec((err, data) => {
        if (err) console.error(err);
        else console.log("✅ Chain query results:", data);
      });
  };
  
  // Test the functions (uncomment to run)
  // setTimeout(() => {
  //   createAndSavePerson();
  //   createManyPeople();
  //   findPeopleByName("Alice");
  //   findOneByFood("burritos");
  //   findAndUpdate("Bob");
  //   queryChain();
  // }, 2000);
  
  console.log("📝 All functions defined. Uncomment the setTimeout block to run them!");
}

// Export for use in other files
module.exports = { Person };