export default class Movie {
  
  constructor(title, rank, gender, isSeen) {
    this.title = title;
    this.rank = rank;
    this.gender = gender;
    this.isSeen = isSeen;
    this.id = `${this.title.slice(0,1)}_${Math.ceil(Math.random() * 10000)}`;
  }

  changeSeen() {
    this.isSeen = !this.isSeen;
  }

  describeMovie() {
    console.log(this.title);
  }

}
