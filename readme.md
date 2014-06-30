#An extension to map server response JSON to JavaScript cunstructor function object instances#

**API**

```javascript
.modelTo( constructureType[, constructureHandler]);
```
*Valid extension for:*

- Array 
- Object

##Examples##

**Example Data**

```javascript 
// JSON data returned from the server
var data = [
    { firstName: 'Paul', lastName: 'Smith', age: 31 },
    { firstName: 'Reza', lastName: 'Ford', age: 26 },
    { firstName: 'Adam', lastName: 'Ryan', age: 34 },
    { firstName: 'Jim', lastName: 'Simpson', age: 20 },
    { firstName: 'Sarah', lastName: 'Pyle', age: 22 }
];

// Person model with behaviour etc.
var Person = function( firstName, lastName, age ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.fullName = this.firstName + ' ' + this.lastName;
};

Person.prototype.changeName = function( firstName, lastName ) {
    this.firstName = firstName || this.firstName;
    this.lastName = lastName || this.lastName;
    this.fullName = this.firstName + ' ' + this.lastName;
    return this;
};

Person.prototype.greet = function() {
    var greeting = 'Hello, my name is ' + this.fullName + ' and I am ' + this.age + ' years young!';
    console.log( greeting );
    return this;
};

```

**Auto Construct Example**

```javascript 
// Calling .modelTo() on the array with just the type will auto construct each object using the constructor
var people = data.modelTo( Person );

people[ 0 ].greet(); //Hello, my name is Paul Smith and I am 31 years young! 
people[ 0 ].changeName( 'Joe', 'Assar' );
people[ 0 ].greet(); //Hello, my name is Joe Assar and I am 31 years young! 
```

**Manual Construct Example**

```javascript 
// Calling .modelTo() on the array and including a constructure handler
var people = data.modelTo( Person, function( personData ) {
    var person = new Person( personData.firstName, personData.lastName, personData.age );
    person.greet(); //Hello, my name is Paul Smith and I am 31 years young! 
    return person;
} );

people[ 0 ].greet(); //Hello, my name is Paul Smith and I am 31 years young! 
people[ 0 ].changeName( 'Joe', 'Assar' );
people[ 0 ].greet(); //Hello, my name is Joe Assar and I am 31 years young! 
```