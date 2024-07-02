function Person(params) {
  this.name = params.name;
  this.arrayOfPersons = [];

  this.introduce = function () {
    console.log(`Меня зовут ${this.name}`);
  };

  this.getConnections = function () {
    return this.arrayOfPersons;
  };

  this.addConnctions = function (obj) {
    if (
      obj instanceof Person &&
      obj !== this &&
      !this.arrayOfPersons.includes(obj)
    ) {
      this.arrayOfPersons.push(obj);
      obj.addConnctions(this);
    }
  };
}

var Ivan = new Person({ name: "Иван Петров" });
var Petr = new Person({ name: "Петр Иванов" });

console.log(Ivan.name); // : Иван Петров
Ivan.introduce(); // : Меня зовут Иван Петров

console.log(Ivan.getConnections()); // : []
Ivan.addConnctions(Petr);
console.log(Ivan.getConnections()); // : [Person { name: 'Петр Иванов' }]
console.log(Petr.getConnections()); // : [Person { name: 'Иван Петров'}]
