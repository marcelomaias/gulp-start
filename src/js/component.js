export default class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

export function printName(user) {
  console.log(`The user name is ${user.name}`);
}
export function printAge(user) {
  console.log(`The user is ${user.age} old`);
}
